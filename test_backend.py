import requests
import sys

BASE_URL = "http://localhost:8000"

endpoints = [
    ("GET", "/api/health", None),
    ("GET", "/api/v1/ships", None),
    ("GET", "/api/v1/digital-twin", None),
    ("GET", "/api/v1/digital-twin/", None),
    ("GET", "/api/v1/operations/kpis", None),
    ("GET", "/api/v1/weather/current", None),
    ("GET", "/api/v1/command-center/overview", None),
    ("GET", "/api/v1/command-center/kpis", None),
    ("GET", "/api/v1/command-center/vessels", None),
    ("GET", "/api/v1/command-center/stations", None),
    ("GET", "/api/v1/command-center/predictions", None),
    ("GET", "/api/v1/command-center/data-health", None),
    ("POST", "/api/v1/telemetry/", {"asset_id": "GEN_01", "temperature": 85.0, "vibration": 12.0, "rpm": 1500.0, "pressure": 30.0}),
    ("POST", "/api/v1/incidents/sos", {"incident_type": "Medical", "affected_asset": "Polar Star", "lat": -65.0, "lon": 70.0}),
]

errors = 0
for method, path, payload in endpoints:
    url = f"{BASE_URL}{path}"
    try:
        if method == "GET":
            res = requests.get(url, timeout=5)
        else:
            res = requests.post(url, json=payload, timeout=5)
        
        if res.status_code >= 400:
            print(f"[FAIL] {method} {path} returned {res.status_code}: {res.text}")
            errors += 1
        else:
            print(f"[PASS] {method} {path} returned {res.status_code}")
    except Exception as e:
        print(f"[ERROR] {method} {path} failed: {e}")
        errors += 1

if errors > 0:
    sys.exit(1)
print("All backend API tests passed.")
sys.exit(0)
