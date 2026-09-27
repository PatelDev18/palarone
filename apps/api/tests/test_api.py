import pytest
from fastapi.testclient import TestClient

# Mocking import to avoid db issues in simple test
import sys
import os
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
API_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
for p in [ROOT_DIR, API_DIR, os.path.join(ROOT_DIR, "services")]:
    if p not in sys.path:
        sys.path.insert(0, p)

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "version" in response.json()

def test_ships_endpoint():
    response = client.get("/api/v1/ships/")
    assert response.status_code == 200
    assert "ships" in response.json()

def test_real_sentinel_provider():
    from services.ingestion.satellite.real_provider import RealSentinelProvider
    provider = RealSentinelProvider()
    assert provider.name == "RealSentinelProvider"
    assert provider.stac_url == "https://earth-search.aws.element84.com/v1/search"

