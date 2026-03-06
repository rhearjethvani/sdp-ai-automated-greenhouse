import random
import numpy as np
import pandas as pd
from joblib import dump
from sklearn.ensemble import RandomForestClassifier


def generate_synthetic(n=5000, seed=42):
    random.seed(seed)
    np.random.seed(seed)
    rows = []
    moisture = 0
    for i in range(n):
        # occasionally simulate watering event
        if random.random() < 0.02:
            moisture = 0  # watered -> wet

        temperature = random.uniform(55, 95)
        humidity = random.uniform(20, 95)

        # base probability to dry next hour
        prob = 0.0
        # if already dry, likely stays dry
        if moisture == 1:
            prob += 0.6
        # higher temperature increases drying
        prob += (temperature - 55) / (95 - 55) * 0.25
        # lower humidity increases drying
        prob += (1 - (humidity - 20) / (95 - 20)) * 0.25

        # clamp and add some noise
        prob = max(0.0, min(1.0, prob + np.random.normal(0, 0.08)))

        dry_next = 1 if random.random() < prob else 0

        rows.append({
            "moisture_state": moisture,
            "temperature": round(temperature, 2),
            "humidity": round(humidity, 2),
            "dry_next_hour": int(dry_next),
        })

        # advance moisture state: if dry_next==1 then next becomes dry else wet
        moisture = int(dry_next == 1)

    return pd.DataFrame(rows)


def train_and_save(path="model.joblib"):
    print("Generating synthetic dataset...")
    df = generate_synthetic(5000)
    X = df[["moisture_state", "temperature", "humidity"]].values
    y = df["dry_next_hour"].values

    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    clf.fit(X, y)

    print(f"Saving model to {path}...")
    dump(clf, path)
    print("Done.")


if __name__ == "__main__":
    train_and_save()
