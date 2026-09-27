from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/missions")
def get_missions() -> Dict[str, Any]:
    """
    Get active polar missions and expeditions (Phase 12).
    """
    return {
        "missions": [
            {
                "id": "m1",
                "name": "Summer Resupply 2026",
                "status": "In Progress",
                "commander": "Cmdr. Hayes",
                "assigned_ships": ["Polar Star", "Aurora Explorer"],
                "stations": ["Davis Station", "Maitri Station"],
                "completion_pct": 66
            }
        ]
    }

@router.get("/tasks")
def get_tasks() -> Dict[str, Any]:
    """
    Get operational Kanban tasks (Phase 15).
    """
    return {
        "tasks": [
            {
                "id": "t1",
                "title": "Inspect Generator #2",
                "priority": "Critical",
                "status": "Pending",
                "assignee": "Eng. Sarah Jenks",
                "station": "Davis Station",
                "due_date": "2026-10-09",
                "source": "AI Predictive Maintenance"
            }
        ]
    }

@router.get("/kpis")
def get_kpis() -> Dict[str, Any]:
    """
    Get dynamic Key Performance Indicators for the Command Center (Phase 42 Refactor).
    """
    # Simulate fetching from database models
    return {
        "active_ships": {
            "value": 4,
            "label": "3 In Transit, 1 At Port"
        },
        "cargo_in_transit": {
            "value": "2,450 t",
            "label": "+12% from last month"
        },
        "active_delays": {
            "value": 1,
            "label": "Polar Star (+1d 6h)"
        },
        "critical_incidents": {
            "value": 0,
            "label": "All systems normal"
        }
    }
