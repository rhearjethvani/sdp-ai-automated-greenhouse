from flask import Flask, jsonify
from flask_cors import CORS
import threading
import time
from datetime import datetime
import os

# ── Hardware imports (only available on the Raspberry Pi) ──────────────────
try:
    from RPLCD.i2c import CharLCD
    from gpiozero import DigitalInputDevice
    from pyftdi.gpio import GpioController
    import board
    import adafruit_dht
    HARDWARE_AVAILABLE = True
except ImportError:
    HARDWARE_AVAILABLE = False
    print("[server] Hardware libraries not found – running in simulation mode")

# ── Flask app ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)  # allow the Vite dev server (port 8080) to call us

# ── Relay / GPIO constants ─────────────────────────────────────────────────
RELAY_OFF = 0x00
RELAY1    = 0x01   # pump
RELAY2    = 0x02   # grow light
RELAY3    = 0x04   # ventilation fan

URL = "ftdi://0x0403:0x6001:A20e1rV9/1"

# ── Shared state ───────────────────────────────────────────────────────────
lock = threading.Lock()

state = {
    "pump":  False,
    "light": False,
    "fan":   False,
    "soil":  "unknown",   # "wet" | "dry" | "unknown"
    "temp_f": None,
    "humidity": None,
}

# ── Log file ───────────────────────────────────────────────────────────────
script_dir    = os.path.dirname(os.path.abspath(__file__))
log_file_path = os.path.join(script_dir, "Greenhouse.txt")

with open(log_file_path, "w") as f:
    f.write("")


def log_event(msg: str):
    ts    = datetime.now().strftime("%I:%M %p")
    entry = f"{ts} {msg}"
    with open(log_file_path, "a") as f:
        f.write(entry + "\n")
    print(entry)


# ── Hardware helpers ───────────────────────────────────────────────────────
def _build_relay_mask() -> int:
    """Return the bitmask that reflects the current on/off state of all relays."""
    mask = RELAY_OFF
    if state["pump"]:  mask |= RELAY1
    if state["light"]: mask |= RELAY2
    if state["fan"]:   mask |= RELAY3
    return mask


def _apply_relays():
    if not HARDWARE_AVAILABLE:
        return
    gpio.write(_build_relay_mask())


# ── Hardware initialisation (Pi only) ─────────────────────────────────────
if HARDWARE_AVAILABLE:
    gpio = GpioController()
    gpio.open_from_url(URL)
    gpio.set_direction(0xFF, 0xFF)

    soil_sensor = DigitalInputDevice(21)

    def _soil_monitor():
        while True:
            raw = int(soil_sensor.value)
            label = "wet" if raw == 0 else "dry"
            with lock:
                state["soil"] = label
            log_event(f"Soil is {label}")
            time.sleep(5)

    def _dht_monitor():
        sensor  = adafruit_dht.DHT11(board.D17, use_pulseio=False)
        readings = []
        while True:
            try:
                temp_c   = sensor.temperature
                humidity = sensor.humidity
                if temp_c is None or humidity is None:
                    raise RuntimeError("DHT returned None")
                temp_f = (temp_c * 9 / 5) + 32
                readings.append(temp_f)
                if len(readings) > 3:
                    readings.pop(0)
                if len(readings) == 3:
                    avg = round(sum(readings) / 3)
                    with lock:
                        state["temp_f"]   = avg
                        state["humidity"] = round(humidity)
            except Exception as e:
                print(f"[DHT] {e}")
            time.sleep(2)

    threading.Thread(target=_soil_monitor, daemon=True).start()
    threading.Thread(target=_dht_monitor,  daemon=True).start()
else:
    # Simulation: fake sensor values so the UI still works on a dev machine
    import random
    def _sim_sensors():
        while True:
            with lock:
                state["soil"]     = random.choice(["wet", "dry"])
                state["temp_f"]   = random.randint(68, 85)
                state["humidity"] = random.randint(40, 70)
            time.sleep(5)

    threading.Thread(target=_sim_sensors, daemon=True).start()


# ── API routes ─────────────────────────────────────────────────────────────

@app.route("/api/status")
def get_status():
    with lock:
        return jsonify(dict(state))


@app.route("/api/pump/on",  methods=["POST"])
def pump_on():
    with lock:
        state["pump"] = True
    _apply_relays()
    log_event("PUMP ON (UI)")
    return jsonify({"pump": True})


@app.route("/api/pump/off", methods=["POST"])
def pump_off():
    with lock:
        state["pump"] = False
    _apply_relays()
    log_event("PUMP OFF (UI)")
    return jsonify({"pump": False})


@app.route("/api/light/on",  methods=["POST"])
def light_on():
    with lock:
        state["light"] = True
    _apply_relays()
    log_event("LIGHT ON (UI)")
    return jsonify({"light": True})


@app.route("/api/light/off", methods=["POST"])
def light_off():
    with lock:
        state["light"] = False
    _apply_relays()
    log_event("LIGHT OFF (UI)")
    return jsonify({"light": False})


@app.route("/api/fan/on",  methods=["POST"])
def fan_on():
    with lock:
        state["fan"] = True
    _apply_relays()
    log_event("FAN ON (UI)")
    return jsonify({"fan": True})


@app.route("/api/fan/off", methods=["POST"])
def fan_off():
    with lock:
        state["fan"] = False
    _apply_relays()
    log_event("FAN OFF (UI)")
    return jsonify({"fan": False})


@app.route("/api/logs")
def get_logs():
    try:
        with open(log_file_path) as f:
            lines = f.readlines()
        return jsonify({"logs": [l.rstrip() for l in lines[-100:]]})
    except FileNotFoundError:
        return jsonify({"logs": []})


# ── Entry point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Run on all interfaces so the Pi is reachable from the same LAN
    app.run(host="0.0.0.0", port=5000, debug=False)
