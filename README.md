# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Running the Greenhouse System

The project has two parts that must run at the same time: the **Flask backend** (controls the hardware) and the **Vite frontend** (the web dashboard).

### 1. Raspberry Pi — Flask backend

The backend reads sensors and drives the relays. Run this on the Pi (or any machine for simulation mode).

**First-time setup:**
```sh
# Install Python dependencies
pip install flask flask-cors

# On the Pi, also install the hardware libraries
pip install RPLCD gpiozero adafruit-circuitpython-dht pyftdi
```

**Start the server:**
```sh
python server.py
```

The server starts on **port 5000**. If the hardware libraries are not installed it automatically runs in simulation mode with random sensor values — useful for development on a non-Pi machine.

> **Note:** If you are running the Pi headlessly, you can keep the server alive with:
> ```sh
> nohup python server.py &
> ```

---

### 2. Web dashboard — Vite frontend

Run this on any machine that can reach the Pi over the network (or on the Pi itself).

**First-time setup:**
```sh
npm install
```

**Start the dev server:**
```sh
npm run dev
```

The dashboard opens at **http://localhost:8080**. All `/api/*` requests are automatically proxied to `http://localhost:5000` (the Flask server).

> **Connecting from a different machine:** open `vite.config.ts` and change the proxy target from `http://localhost:5000` to the Pi's IP address, e.g. `http://192.168.1.42:5000`.

---

### API endpoints (Flask)

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Current state of all devices + sensor readings |
| `/api/pump/on` | POST | Turn irrigation pump ON |
| `/api/pump/off` | POST | Turn irrigation pump OFF |
| `/api/light/on` | POST | Turn grow light ON |
| `/api/light/off` | POST | Turn grow light OFF |
| `/api/fan/on` | POST | Turn ventilation fan ON |
| `/api/fan/off` | POST | Turn ventilation fan OFF |
| `/api/logs` | GET | Last 100 lines of `Greenhouse.txt` |

---

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
