from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import io
import csv

router = APIRouter()

@router.get("/export/incidents")
def export_incidents_csv():
    """
    Phase 23: Data Export & Reporting.
    Exports all active incidents as a CSV file.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Incident ID", "Severity", "Location", "Status"])
    
    # Mock data fetch
    incidents = [
        ["inc_001", "Medium", "Davis Station Route", "Response Active"]
    ]
    
    for inc in incidents:
        writer.writerow(inc)
        
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=incidents_export.csv"}
    )
