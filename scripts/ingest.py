import sys
import os

# Add root to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__) + "/.."))
# Add apps/api to python path
sys.path.append(os.path.abspath(os.path.dirname(__file__) + "/../apps/api"))

from services.ingestion.orchestrator import IngestionOrchestrator

if __name__ == "__main__":
    orchestrator = IngestionOrchestrator()
    orchestrator.run_pipeline()
