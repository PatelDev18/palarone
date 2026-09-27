import os
import csv
import uuid
import random
from datetime import datetime, timedelta

DATA_DIR = r"d:\2026062\polarone\data\synthetic"

# Generate Ships
def generate_ships():
    ships = [
        {"id": str(uuid.uuid4()), "name": "Polar Star", "imo": "IMO9123456", "type": "Icebreaker", "status": "In Transit"},
        {"id": str(uuid.uuid4()), "name": "Aurora Explorer", "imo": "IMO9234567", "type": "Research Vessel", "status": "In Transit"},
        {"id": str(uuid.uuid4()), "name": "Southern Cross", "imo": "IMO9345678", "type": "Cargo", "status": "At Port"},
        {"id": str(uuid.uuid4()), "name": "Arctic Voyager", "imo": "IMO9456789", "type": "Icebreaker", "status": "In Transit"}
    ]
    with open(os.path.join(DATA_DIR, "ships.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "imo", "type", "status"])
        writer.writeheader()
        writer.writerows(ships)
    return ships

# Generate Stations
def generate_stations():
    stations = [
        {"id": str(uuid.uuid4()), "name": "Davis Station", "type": "Research", "occupancy": 80, "lat": -68.57, "lon": 77.96},
        {"id": str(uuid.uuid4()), "name": "Maitri Station", "type": "Research", "occupancy": 65, "lat": -70.76, "lon": 11.73},
        {"id": str(uuid.uuid4()), "name": "Bharati Station", "type": "Research", "occupancy": 47, "lat": -69.40, "lon": 76.19},
        {"id": str(uuid.uuid4()), "name": "Cape Town Port", "type": "Logistics", "occupancy": 500, "lat": -33.91, "lon": 18.42},
        {"id": str(uuid.uuid4()), "name": "Hobart Port", "type": "Logistics", "occupancy": 400, "lat": -42.88, "lon": 147.32}
    ]
    with open(os.path.join(DATA_DIR, "stations.csv"), "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "name", "type", "occupancy", "lat", "lon"])
        writer.writeheader()
        writer.writerows(stations)
    return stations

if __name__ == "__main__":
    ships = generate_ships()
    stations = generate_stations()
    print("Synthetic basic data generated.")
