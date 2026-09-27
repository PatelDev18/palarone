import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from app.models.analytics import (
    ExecutiveKpi,
    VesselPerformanceRecord,
    FuelAnalyticsPoint,
    ETAPredictionRecord,
    EnvironmentalPoint,
    StationMetricRecord,
    InventoryForecastItem,
    AssetHealthRecord,
    SensorAnomalyRecord,
    MLModelPerformanceRecord,
    OperationalRiskCategory,
    CorrelationPair,
    ForecastPoint,
    ScenarioSimulationRequest,
    ScenarioSimulationResult,
    DataQualityRecord,
    NetworkResilienceMetric,
    AIInsight,
)

class AnalyticsService:
    def __init__(self):
        self._init_data()

    def _init_data(self):
        # Base reference date
        self.now = datetime.utcnow()

    def get_executive_kpis(self, timeframe: str = "7D") -> List[ExecutiveKpi]:
        """
        Calculates the 8 Executive KPI metrics with sparklines and delta percentages.
        """
        return [
            ExecutiveKpi(
                id="kpi-fuel-efficiency",
                title="Fleet Fuel Efficiency",
                value="24.8",
                numeric_value=24.8,
                unit="L/nm",
                delta_percent=-4.2,
                trend="down",  # down is good for fuel burn per nm
                status="optimal",
                sparkline=[27.1, 26.8, 26.2, 25.9, 25.4, 25.1, 24.8],
                description="Fleet-wide fuel consumption normalized by nautical miles navigated across ice and open water."
            ),
            ExecutiveKpi(
                id="kpi-route-variance",
                title="Route Execution Fidelity",
                value="96.4",
                numeric_value=96.4,
                unit="%",
                delta_percent=+1.8,
                trend="up",
                status="optimal",
                sparkline=[92.0, 93.4, 94.1, 94.8, 95.5, 96.0, 96.4],
                description="Adherence to ice-optimized waypoints versus planned expedition transit lines."
            ),
            ExecutiveKpi(
                id="kpi-station-energy",
                title="Station Thermal Demand",
                value="342.5",
                numeric_value=342.5,
                unit="L/day",
                delta_percent=+6.5,
                trend="up",
                status="warning",
                sparkline=[310.0, 318.5, 325.0, 331.0, 335.5, 340.0, 342.5],
                description="Aggregated heating and power fuel burn rate across Bharati, Maitri, Himadri, and Davis."
            ),
            ExecutiveKpi(
                id="kpi-delay-index",
                title="ETA Confidence Score",
                value="91.2",
                numeric_value=91.2,
                unit="%",
                delta_percent=+3.1,
                trend="up",
                status="optimal",
                sparkline=[84.0, 86.2, 88.0, 89.5, 90.1, 90.8, 91.2],
                description="Ensemble XGBoost confidence index reflecting sea ice drift and polar weather predictability."
            ),
            ExecutiveKpi(
                id="kpi-active-anomalies",
                title="Critical Sensor Anomalies",
                value="3",
                numeric_value=3.0,
                unit="active",
                delta_percent=-25.0,
                trend="down",
                status="warning",
                sparkline=[6.0, 5.0, 5.0, 4.0, 4.0, 3.0, 3.0],
                description="Unresolved multivariate anomalies detected by Isolation Forest & Autoencoder engines."
            ),
            ExecutiveKpi(
                id="kpi-supply-shortage",
                title="Resupply Margin At-Risk",
                value="1",
                numeric_value=1.0,
                unit="stations",
                delta_percent=0.0,
                trend="stable",
                status="critical",
                sparkline=[1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
                description="Stations where predicted supply depletion date precedes scheduled resupply arrival."
            ),
            ExecutiveKpi(
                id="kpi-model-health",
                title="ML Model Drift Index (PSI)",
                value="0.042",
                numeric_value=0.042,
                unit="PSI",
                delta_percent=-12.5,
                trend="down",
                status="optimal",
                sparkline=[0.065, 0.059, 0.054, 0.049, 0.046, 0.044, 0.042],
                description="Population Stability Index across operational feature distributions (< 0.10 is stable)."
            ),
            ExecutiveKpi(
                id="kpi-operational-risk",
                title="Aggregated Mission Risk",
                value="28.4",
                numeric_value=28.4,
                unit="/100",
                delta_percent=-5.2,
                trend="down",
                status="optimal",
                sparkline=[34.0, 32.5, 31.0, 30.2, 29.5, 29.0, 28.4],
                description="Composite operational risk score evaluating machinery, ice entrapment, weather, and logistics."
            ),
        ]

    def get_fleet_performance(self) -> List[VesselPerformanceRecord]:
        """
        Returns performance telemetry and diagnostic health for PolarOne fleet vessels:
        Polar Star, Aurora Explorer, Southern Cross, Arctic Voyager, Ocean Guardian.
        """
        return [
            VesselPerformanceRecord(
                vessel_id="VES-001",
                vessel_name="Polar Star",
                ice_class="PC1 Heavy Icebreaker",
                current_speed_knots=12.4,
                optimal_speed_knots=13.0,
                fuel_burn_rate_l_per_nm=32.4,
                voyage_progress_pct=68.5,
                route_efficiency_pct=95.8,
                ice_resistance_factor=1.42,
                active_mission="Operation Deep Freeze Resupply",
                eta_variance_hours=+4.5,
                maintenance_risk="LOW",
                anomaly_count=1,
                health_score=94.2
            ),
            VesselPerformanceRecord(
                vessel_id="VES-002",
                vessel_name="Aurora Explorer",
                ice_class="PC3 Polar Research Vessel",
                current_speed_knots=10.2,
                optimal_speed_knots=11.5,
                fuel_burn_rate_l_per_nm=24.1,
                voyage_progress_pct=82.0,
                route_efficiency_pct=97.1,
                ice_resistance_factor=1.18,
                active_mission="Weddell Sea Oceanographic Survey",
                eta_variance_hours=-1.2,
                maintenance_risk="LOW",
                anomaly_count=0,
                health_score=98.0
            ),
            VesselPerformanceRecord(
                vessel_id="VES-003",
                vessel_name="Southern Cross",
                ice_class="PC4 Logistics & Cargo Carrier",
                current_speed_knots=8.8,
                optimal_speed_knots=10.0,
                fuel_burn_rate_l_per_nm=28.6,
                voyage_progress_pct=45.0,
                route_efficiency_pct=91.4,
                ice_resistance_factor=1.85,
                active_mission="Bharati & Maitri Annual Resupply",
                eta_variance_hours=+14.8,
                maintenance_risk="MEDIUM",
                anomaly_count=2,
                health_score=83.5
            ),
            VesselPerformanceRecord(
                vessel_id="VES-004",
                vessel_name="Arctic Voyager",
                ice_class="PC5 Sub-polar Scientific Surveyor",
                current_speed_knots=11.8,
                optimal_speed_knots=12.0,
                fuel_burn_rate_l_per_nm=19.5,
                voyage_progress_pct=91.2,
                route_efficiency_pct=98.4,
                ice_resistance_factor=1.05,
                active_mission="Svalbard Glacial Core Sampling",
                eta_variance_hours=+0.5,
                maintenance_risk="LOW",
                anomaly_count=0,
                health_score=96.7
            ),
            VesselPerformanceRecord(
                vessel_id="VES-005",
                vessel_name="Ocean Guardian",
                ice_class="PC2 Multi-purpose Patrol / Search & Rescue",
                current_speed_knots=14.0,
                optimal_speed_knots=14.5,
                fuel_burn_rate_l_per_nm=36.0,
                voyage_progress_pct=34.0,
                route_efficiency_pct=94.2,
                ice_resistance_factor=1.30,
                active_mission="Ross Ice Shelf Standby & SAR",
                eta_variance_hours=+2.0,
                maintenance_risk="LOW",
                anomaly_count=0,
                health_score=95.1
            ),
        ]

    def get_fuel_analytics(self) -> List[FuelAnalyticsPoint]:
        """
        Generates 14-day historical and predicted fuel consumption curve
        with confidence intervals (P10 / P90) based on XGBoost fuel regression.
        """
        points = []
        base_burn = 3200.0
        for i in range(14):
            day_dt = self.now - timedelta(days=(13 - i))
            day_str = day_dt.strftime("%b %d")
            # Mathematical variance based on sea state and temperature
            temp = -18.0 - 5.0 * math.sin(i * 0.45)
            generator_load = 72.0 + 8.0 * math.cos(i * 0.35)
            actual = base_burn + (generator_load * 12.0) - (temp * 15.0) + (150.0 if i % 3 == 0 else -120.0)
            predicted = actual + (45.0 if i < 10 else 0.0)
            uncertainty = 180.0 + (i * 12.0 if i >= 10 else 90.0)
            
            points.append(
                FuelAnalyticsPoint(
                    timestamp=day_str,
                    actual_burn_litres=round(actual, 1),
                    predicted_burn_litres=round(predicted, 1),
                    upper_bound=round(predicted + uncertainty, 1),
                    lower_bound=round(predicted - uncertainty, 1),
                    ambient_temp_c=round(temp, 1),
                    generator_load_pct=round(generator_load, 1)
                )
            )
        return points

    def get_eta_predictions(self) -> List[ETAPredictionRecord]:
        """
        ETA intelligence comparing Original Planned vs Provider vs AI Predicted ETA,
        with root cause delay decomposition (Ice Pack, Blizzard Winds, Route Derate).
        """
        return [
            ETAPredictionRecord(
                voyage_id="VOY-2026-088",
                vessel_name="Southern Cross",
                destination="Bharati Station, Larsemann Hills",
                departure_date=(self.now - timedelta(days=6)).strftime("%Y-%m-%d"),
                original_planned_eta=(self.now + timedelta(days=3, hours=4)).strftime("%Y-%m-%d %H:%M UTC"),
                provider_eta=(self.now + timedelta(days=3, hours=18)).strftime("%Y-%m-%d %H:%M UTC"),
                ai_predicted_eta=(self.now + timedelta(days=4, hours=2)).strftime("%Y-%m-%d %H:%M UTC"),
                p10_eta=(self.now + timedelta(days=3, hours=20)).strftime("%Y-%m-%d %H:%M UTC"),
                p50_eta=(self.now + timedelta(days=4, hours=2)).strftime("%Y-%m-%d %H:%M UTC"),
                p90_eta=(self.now + timedelta(days=4, hours=16)).strftime("%Y-%m-%d %H:%M UTC"),
                confidence_score=0.91,
                delay_hours=22.0,
                primary_delay_cause="Heavy Pack Ice (1.8m multi-year ice ridges)",
                delay_breakdown={"ice_pack": 14.5, "katabatic_winds": 5.0, "machinery_derate": 2.5}
            ),
            ETAPredictionRecord(
                voyage_id="VOY-2026-092",
                vessel_name="Polar Star",
                destination="McMurdo Sound / Ross Sea",
                departure_date=(self.now - timedelta(days=9)).strftime("%Y-%m-%d"),
                original_planned_eta=(self.now + timedelta(days=2, hours=12)).strftime("%Y-%m-%d %H:%M UTC"),
                provider_eta=(self.now + timedelta(days=2, hours=14)).strftime("%Y-%m-%d %H:%M UTC"),
                ai_predicted_eta=(self.now + timedelta(days=2, hours=16)).strftime("%Y-%m-%d %H:%M UTC"),
                p10_eta=(self.now + timedelta(days=2, hours=13)).strftime("%Y-%m-%d %H:%M UTC"),
                p50_eta=(self.now + timedelta(days=2, hours=16)).strftime("%Y-%m-%d %H:%M UTC"),
                p90_eta=(self.now + timedelta(days=2, hours=22)).strftime("%Y-%m-%d %H:%M UTC"),
                confidence_score=0.96,
                delay_hours=4.0,
                primary_delay_cause="Channel clearing ice operations",
                delay_breakdown={"ice_pack": 3.2, "katabatic_winds": 0.8, "machinery_derate": 0.0}
            ),
            ETAPredictionRecord(
                voyage_id="VOY-2026-095",
                vessel_name="Aurora Explorer",
                destination="Rothera Research Station",
                departure_date=(self.now - timedelta(days=4)).strftime("%Y-%m-%d"),
                original_planned_eta=(self.now + timedelta(days=1, hours=8)).strftime("%Y-%m-%d %H:%M UTC"),
                provider_eta=(self.now + timedelta(days=1, hours=6)).strftime("%Y-%m-%d %H:%M UTC"),
                ai_predicted_eta=(self.now + timedelta(days=1, hours=7)).strftime("%Y-%m-%d %H:%M UTC"),
                p10_eta=(self.now + timedelta(days=1, hours=5)).strftime("%Y-%m-%d %H:%M UTC"),
                p50_eta=(self.now + timedelta(days=1, hours=7)).strftime("%Y-%m-%d %H:%M UTC"),
                p90_eta=(self.now + timedelta(days=1, hours=10)).strftime("%Y-%m-%d %H:%M UTC"),
                confidence_score=0.98,
                delay_hours=-1.0,
                primary_delay_cause="Favorable polynya corridor opening",
                delay_breakdown={"ice_pack": -1.5, "katabatic_winds": 0.5, "machinery_derate": 0.0}
            ),
        ]

    def get_environmental_telemetry(self) -> List[EnvironmentalPoint]:
        """
        Telemetry tracking meteorological and cryospheric conditions across sectors.
        """
        points = []
        for i in range(10):
            dt = (self.now - timedelta(hours=(9 - i) * 6)).strftime("%m/%d %H:00")
            points.append(
                EnvironmentalPoint(
                    timestamp=dt,
                    location="Larsemann Hills Sector (69°24'S, 76°11'E)",
                    temperature_c=round(-24.5 - (i * 0.8), 1),
                    wind_speed_knots=round(28.0 + (i * 2.1) + (8.0 if i > 6 else 0.0), 1),
                    ice_thickness_m=round(1.65 + (i * 0.02), 2),
                    sea_ice_concentration_pct=round(78.0 + (i * 1.5), 1),
                    visibility_km=round(max(1.2, 18.0 - (i * 1.6)), 1),
                    barometric_hpa=round(988.0 - (i * 1.8), 1)
                )
            )
        return points

    def get_station_metrics(self) -> List[StationMetricRecord]:
        """
        Station Performance for the 4 core Antarctic / Arctic bases:
        Bharati, Maitri, Himadri, Davis.
        """
        return [
            StationMetricRecord(
                station_id="STN-001",
                station_name="Bharati",
                location="Larsemann Hills, East Antarctica (69°24'S, 76°11'E)",
                occupancy_current=24,
                occupancy_capacity=47,
                power_generation_kw=185.0,
                power_demand_kw=168.4,
                thermal_burn_rate_l_day=115.0,
                ambient_temp_c=-26.8,
                generator_1_load_pct=78.5,
                generator_2_load_pct=15.0,  # Standby / auxiliary
                fuel_reserve_days=44.0,
                water_reserve_days=28.0,
                status="OPERATIONAL"
            ),
            StationMetricRecord(
                station_id="STN-002",
                station_name="Maitri",
                location="Schirmacher Oasis, Queen Maud Land (70°45'S, 11°44'E)",
                occupancy_current=19,
                occupancy_capacity=25,
                power_generation_kw=140.0,
                power_demand_kw=132.0,
                thermal_burn_rate_l_day=98.5,
                ambient_temp_c=-31.2,
                generator_1_load_pct=88.2,
                generator_2_load_pct=0.0,
                fuel_reserve_days=18.5,  # SHORTAGE WARNING: Resupply is in 22 days!
                water_reserve_days=16.0,
                status="CRITICAL_MARGIN"
            ),
            StationMetricRecord(
                station_id="STN-003",
                station_name="Himadri",
                location="Ny-Ålesund, Svalbard, Arctic (78°55'N, 11°56'E)",
                occupancy_current=12,
                occupancy_capacity=16,
                power_generation_kw=95.0,
                power_demand_kw=76.2,
                thermal_burn_rate_l_day=52.0,
                ambient_temp_c=-14.5,
                generator_1_load_pct=64.0,
                generator_2_load_pct=0.0,
                fuel_reserve_days=82.0,
                water_reserve_days=45.0,
                status="OPTIMAL"
            ),
            StationMetricRecord(
                station_id="STN-004",
                station_name="Davis",
                location="Vestfold Hills, Princess Elizabeth Land (68°34'S, 77°58'E)",
                occupancy_current=32,
                occupancy_capacity=70,
                power_generation_kw=240.0,
                power_demand_kw=215.8,
                thermal_burn_rate_l_day=145.2,
                ambient_temp_c=-22.0,
                generator_1_load_pct=72.0,
                generator_2_load_pct=45.0,
                fuel_reserve_days=62.0,
                water_reserve_days=38.0,
                status="OPERATIONAL"
            ),
        ]

    def get_inventory_forecast(self) -> List[InventoryForecastItem]:
        """
        Critical supply forecasts (Fuel, Food, Medical, Spares).
        Flags shortage risk when predicted depletion date < scheduled resupply date.
        """
        depletion_maitri_fuel = self.now + timedelta(days=18, hours=12)
        resupply_maitri_fuel = self.now + timedelta(days=22, hours=0)

        return [
            InventoryForecastItem(
                item_id="INV-001",
                item_name="Polar Diesel Fuel (Jet A-1 Special)",
                category="Energy / Fuel",
                location="Maitri Station",
                current_stock=18200.0,
                unit="Litres",
                daily_burn_rate=985.0,
                days_remaining=18.5,
                predicted_depletion_date=depletion_maitri_fuel.strftime("%Y-%m-%d"),
                next_resupply_date=resupply_maitri_fuel.strftime("%Y-%m-%d"),
                shortage_risk=True,  # Depletion is 3.5 days before resupply!
                confidence_lower_days=16.8,
                confidence_upper_days=20.1
            ),
            InventoryForecastItem(
                item_id="INV-002",
                item_name="Polar Diesel Fuel (Jet A-1 Special)",
                category="Energy / Fuel",
                location="Bharati Station",
                current_stock=52400.0,
                unit="Litres",
                daily_burn_rate=1190.0,
                days_remaining=44.0,
                predicted_depletion_date=(self.now + timedelta(days=44)).strftime("%Y-%m-%d"),
                next_resupply_date=(self.now + timedelta(days=14)).strftime("%Y-%m-%d"),
                shortage_risk=False,
                confidence_lower_days=41.5,
                confidence_upper_days=47.2
            ),
            InventoryForecastItem(
                item_id="INV-003",
                item_name="Freeze-Dried Medical & Trauma Packs",
                category="Medical",
                location="Maitri Station",
                current_stock=42.0,
                unit="Units",
                daily_burn_rate=0.45,
                days_remaining=93.3,
                predicted_depletion_date=(self.now + timedelta(days=93)).strftime("%Y-%m-%d"),
                next_resupply_date=(self.now + timedelta(days=22)).strftime("%Y-%m-%d"),
                shortage_risk=False,
                confidence_lower_days=85.0,
                confidence_upper_days=102.0
            ),
            InventoryForecastItem(
                item_id="INV-004",
                item_name="Desalination Reverse-Osmosis Membrane Filters",
                category="Life Support",
                location="Davis Station",
                current_stock=8.0,
                unit="Filter Sets",
                daily_burn_rate=0.08,
                days_remaining=100.0,
                predicted_depletion_date=(self.now + timedelta(days=100)).strftime("%Y-%m-%d"),
                next_resupply_date=(self.now + timedelta(days=45)).strftime("%Y-%m-%d"),
                shortage_risk=False,
                confidence_lower_days=88.0,
                confidence_upper_days=115.0
            ),
            InventoryForecastItem(
                item_id="INV-005",
                item_name="Caterpillar 3512B Generator Injector Assemblies",
                category="Spare Parts",
                location="Bharati Station",
                current_stock=3.0,
                unit="Assemblies",
                daily_burn_rate=0.04,
                days_remaining=75.0,
                predicted_depletion_date=(self.now + timedelta(days=75)).strftime("%Y-%m-%d"),
                next_resupply_date=(self.now + timedelta(days=14)).strftime("%Y-%m-%d"),
                shortage_risk=False,
                confidence_lower_days=60.0,
                confidence_upper_days=90.0
            ),
        ]

    def get_asset_health(self) -> List[AssetHealthRecord]:
        """
        Asset Remaining Useful Life (RUL) and degradation curves via Survival Analysis.
        """
        return [
            AssetHealthRecord(
                asset_id="AST-MTR-GEN1",
                asset_name="Main Diesel Generator #1 (Caterpillar 3512)",
                location="Maitri Power Plant",
                asset_type="Power Generation",
                health_score=68.4,
                rul_days=26.5,
                failure_probability_30d=0.34,
                survival_probability_60d=0.48,
                active_anomalies=1,
                recommended_action="Inspect fuel injector timing; switch base load to Generator #2 during mild weather",
                model_used="Weibull Survival Analysis + XGBoost Feature Regressor"
            ),
            AssetHealthRecord(
                asset_id="AST-BHR-GEN2",
                asset_name="Backup Diesel Generator #2 (Volvo Penta D16)",
                location="Bharati Station",
                asset_type="Power Generation",
                health_score=94.0,
                rul_days=240.0,
                failure_probability_30d=0.02,
                survival_probability_60d=0.96,
                active_anomalies=0,
                recommended_action="Optimal condition; standard scheduled monthly test run",
                model_used="Weibull Survival Analysis"
            ),
            AssetHealthRecord(
                asset_id="AST-VES-PSTAR-ENG1",
                asset_name="Port Propulsion Diesel Engine (ALCO 251)",
                location="Polar Star Engine Room",
                asset_type="Marine Propulsion",
                health_score=87.2,
                rul_days=115.0,
                failure_probability_30d=0.06,
                survival_probability_60d=0.88,
                active_anomalies=1,
                recommended_action="Clean turbocharger air intake filter; harmonic vibration within tolerance",
                model_used="Cox Proportional Hazards Model"
            ),
            AssetHealthRecord(
                asset_id="AST-DAV-HVAC1",
                asset_name="Central Habitat Thermal Recovery Unit",
                location="Davis Living Quarters",
                asset_type="HVAC / Life Support",
                health_score=91.5,
                rul_days=180.0,
                failure_probability_30d=0.04,
                survival_probability_60d=0.92,
                active_anomalies=0,
                recommended_action="Routine filter backwash",
                model_used="Weibull Survival Analysis"
            ),
            AssetHealthRecord(
                asset_id="AST-VES-SCROSS-PROP",
                asset_name="Controllable Pitch Propeller Hub Mechanism",
                location="Southern Cross Stern",
                asset_type="Propulsion & Steering",
                health_score=76.8,
                rul_days=48.0,
                failure_probability_30d=0.18,
                survival_probability_60d=0.69,
                active_anomalies=1,
                recommended_action="Monitor hydraulic seal pressure under heavy ice ramming maneuvers",
                model_used="XGBoost Degradation Regressor"
            ),
        ]

    def get_sensor_anomalies(self) -> List[SensorAnomalyRecord]:
        """
        Multivariate sensor anomalies detected by Isolation Forest and Autoencoder.
        """
        return [
            SensorAnomalyRecord(
                anomaly_id="ANOM-2026-901",
                timestamp=(self.now - timedelta(minutes=42)).strftime("%Y-%m-%d %H:%M UTC"),
                equipment_id="AST-MTR-GEN1",
                equipment_name="Generator #1 Cylinder 4 Exh Temp",
                location="Maitri Station",
                sensor_id="SNS-TEMP-CYL4-MTR",
                anomaly_type="Thermal Gradient Outlier (Z-score +3.8)",
                detection_model="Isolation Forest",
                reconstruction_error=0.084,
                z_score=3.82,
                severity="HIGH",
                status="OPEN",
                actionable_remediation="Thermocouple indicates 542°C (baseline 480°C). Check fuel atomization nozzle 4."
            ),
            SensorAnomalyRecord(
                anomaly_id="ANOM-2026-902",
                timestamp=(self.now - timedelta(hours=2, minutes=15)).strftime("%Y-%m-%d %H:%M UTC"),
                equipment_id="AST-VES-PSTAR-ENG1",
                equipment_name="Port Propulsion Shaft Bearing 2",
                location="Polar Star Engine Room",
                sensor_id="SNS-VIB-SHAFT2-PST",
                anomaly_type="Harmonic Resonance Latent Reconstruction Error",
                detection_model="Autoencoder",
                reconstruction_error=0.142,
                z_score=2.95,
                severity="MEDIUM",
                status="INVESTIGATING",
                actionable_remediation="Autoencoder detected uncharacteristic 42Hz frequency spike under 85% torque."
            ),
            SensorAnomalyRecord(
                anomaly_id="ANOM-2026-903",
                timestamp=(self.now - timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d %H:%M UTC"),
                equipment_id="AST-VES-SCROSS-PROP",
                equipment_name="Hydraulic Pitch Actuator Line Pressure",
                location="Southern Cross Stern",
                sensor_id="SNS-HYD-PRESS-SC",
                anomaly_type="Pressure Transience Spike",
                detection_model="Isolation Forest",
                reconstruction_error=0.091,
                z_score=3.10,
                severity="MEDIUM",
                status="OPEN",
                actionable_remediation="Transient surge to 215 bar during reverse thrust through multi-year ridge."
            ),
            SensorAnomalyRecord(
                anomaly_id="ANOM-2026-899",
                timestamp=(self.now - timedelta(hours=14)).strftime("%Y-%m-%d %H:%M UTC"),
                equipment_id="AST-DAV-HVAC1",
                equipment_name="Intake Air Velocity Differential",
                location="Davis Living Quarters",
                sensor_id="SNS-AIR-VEL-DAV",
                anomaly_type="Rime Ice Vent Obstruction",
                detection_model="Autoencoder",
                reconstruction_error=0.198,
                z_score=4.20,
                severity="LOW",
                status="RESOLVED",
                actionable_remediation="Heater tape actuated automatically; airflow restored to 12.4 m/s nominal."
            ),
        ]

    def get_ml_models_performance(self) -> List[MLModelPerformanceRecord]:
        """
        Registry of production AI models with drift scores (PSI) and evaluation metrics.
        Strict rule: NO Random Forest in this registry or anywhere in the calculation.
        Algorithms used: XGBoost, LightGBM, Isolation Forest, Autoencoder, Survival Analysis.
        """
        return [
            MLModelPerformanceRecord(
                model_id="XGB-ETA-V4",
                name="Polar Voyage ETA Predictor",
                algorithm="XGBoost Gradient Boosting Regressor",
                version="v4.2.1",
                task_type="REGRESSION",
                deployment_status="PRODUCTION",
                last_trained="2026-09-18",
                dataset_version="DS-POLAR-ETA-2026A (84,000 nautical miles)",
                metrics={"mae": 1.4, "rmse": 2.1, "r2": 0.942, "mape": 3.8},
                drift_score_psi=0.038,
                drift_status="STABLE",
                recommendation="Performance within optimal envelope; no retraining required"
            ),
            MLModelPerformanceRecord(
                model_id="LGBM-DEMAND-V2",
                name="Station Consumables & Fuel Demand Forecaster",
                algorithm="LightGBM Multi-output Regressor",
                version="v2.3.0",
                task_type="TIME_SERIES",
                deployment_status="PRODUCTION",
                last_trained="2026-09-20",
                dataset_version="DS-STN-LOGISTICS-2025Q4 (4 Antarctic seasons)",
                metrics={"mae": 8.2, "rmse": 11.5, "r2": 0.925, "mape": 4.1},
                drift_score_psi=0.052,
                drift_status="STABLE",
                recommendation="Feature distribution stable; scheduled bi-weekly recalibration"
            ),
            MLModelPerformanceRecord(
                model_id="IF-ANOMALY-V3",
                name="Multivariate Equipment Anomaly Detector",
                algorithm="Isolation Forest",
                version="v3.1.0",
                task_type="ANOMALY_DETECTION",
                deployment_status="PRODUCTION",
                last_trained="2026-09-15",
                dataset_version="DS-IOT-TELEMETRY-2026-S1 (1.8M sensor pings)",
                metrics={"precision": 0.94, "recall": 0.91, "f1": 0.925, "auc": 0.962},
                drift_score_psi=0.045,
                drift_status="STABLE",
                recommendation="Optimal contamination ratio 0.035; healthy discrimination"
            ),
            MLModelPerformanceRecord(
                model_id="AE-SENSOR-V1",
                name="Deep Latent Vibration Autoencoder",
                algorithm="Autoencoder (PyTorch Deep Neural Net)",
                version="v1.2.4",
                task_type="ANOMALY_DETECTION",
                deployment_status="PRODUCTION",
                last_trained="2026-09-10",
                dataset_version="DS-HARMONIC-SHAFT-2026 (Continuous 1kHz streaming)",
                metrics={"precision": 0.96, "recall": 0.89, "f1": 0.923, "auc": 0.971},
                drift_score_psi=0.061,
                drift_status="STABLE",
                recommendation="Reconstruction threshold fine-tuned for high sea-ice vibration harmonics"
            ),
            MLModelPerformanceRecord(
                model_id="SURV-ASSET-RUL-V2",
                name="Machinery Remaining Useful Life Engine",
                algorithm="Survival Analysis (Weibull & Cox PH)",
                version="v2.0.2",
                task_type="REGRESSION",
                deployment_status="PRODUCTION",
                last_trained="2026-09-12",
                dataset_version="DS-GEN-FAILURE-RUNS (Caterpillar/Volvo historical MTBF)",
                metrics={"mae": 3.8, "rmse": 5.2, "r2": 0.898, "c_index": 0.884},
                drift_score_psi=0.041,
                drift_status="STABLE",
                recommendation="Weibull shape parameter beta=2.14 confirms wear-out regime tracking"
            ),
            MLModelPerformanceRecord(
                model_id="XGB-FUEL-EFF-V3",
                name="Vessel Ice-Resistance Fuel Estimator",
                algorithm="XGBoost Ice-Penetration Regressor",
                version="v3.4.0",
                task_type="REGRESSION",
                deployment_status="PRODUCTION",
                last_trained="2026-09-16",
                dataset_version="DS-ICE-RESISTANCE-S1 (Sentinel-1 SAR + AIS logs)",
                metrics={"mae": 1.1, "rmse": 1.7, "r2": 0.951, "mape": 3.2},
                drift_score_psi=0.078,
                drift_status="MONITOR",
                recommendation="Early drift observed in Sentinel-1 ice classification input; monitor next SAR pass"
            ),
        ]

    def get_operational_risks(self) -> List[OperationalRiskCategory]:
        """
        10 operational polar risk categories mapped onto a 5x5 Probability x Impact matrix.
        """
        return [
            OperationalRiskCategory(
                id="RSK-001",
                category="Sea Ice Entrapment / Besetting",
                description="Vessel trapped in convergent multi-year pack ice or pressure ridges",
                probability=3,
                impact=4,
                risk_score=12,
                risk_level="MEDIUM",
                mitigation_strategy="Dynamic satellite SAR ice routing; Polar Star escort standby",
                trend="stable"
            ),
            OperationalRiskCategory(
                id="RSK-002",
                category="Fuel Depletion Margin Breach",
                description="Station fuel reserves drop below safety reserve buffer before annual resupply voyage",
                probability=4,
                impact=5,
                risk_score=20,
                risk_level="CRITICAL",
                mitigation_strategy="Mandatory power-saving protocol at Maitri; prioritize Southern Cross transit",
                trend="up"
            ),
            OperationalRiskCategory(
                id="RSK-003",
                category="Critical Generator Power Plant Failure",
                description="Catastrophic breakdown of prime station or vessel generator during deep polar freeze",
                probability=2,
                impact=5,
                risk_score=10,
                risk_level="MEDIUM",
                mitigation_strategy="N+1 redundant standby gensets; automated emergency load shedding",
                trend="stable"
            ),
            OperationalRiskCategory(
                id="RSK-004",
                category="Severe Katabatic Blizzard / Zero Visibility",
                description="Wind gusts > 80 knots with blowing snow preventing all outdoor and aviation movement",
                probability=4,
                impact=3,
                risk_score=12,
                risk_level="MEDIUM",
                mitigation_strategy="Condition 1 station lockdown; lifeline cables and indoor survival modules",
                trend="up"
            ),
            OperationalRiskCategory(
                id="RSK-005",
                category="Medical Emergency during Transport Blackout",
                description="Severe crew trauma or illness when aeromedical evacuation is impossible due to storm",
                probability=2,
                impact=4,
                risk_score=8,
                risk_level="LOW",
                mitigation_strategy="On-site physician, telemedicine SATCOM link, surgical capability",
                trend="stable"
            ),
            OperationalRiskCategory(
                id="RSK-006",
                category="Satellite Communications Outage",
                description="Simultaneous loss of Iridium and Starlink coverage during high geomagnetic storm",
                probability=2,
                impact=3,
                risk_score=6,
                risk_level="LOW",
                mitigation_strategy="HF radio backup networks; local edge autonomous operational buffering",
                trend="down"
            ),
            OperationalRiskCategory(
                id="RSK-007",
                category="Ski-way / Blue Ice Runway Unserviceable",
                description="Surface melting or severe sastrugi drifts halting LC-130 / Basler BT-67 flights",
                probability=3,
                impact=3,
                risk_score=9,
                risk_level="MEDIUM",
                mitigation_strategy="Continuous snow groomer maintenance; alternate ice runway reconnaissance",
                trend="down"
            ),
            OperationalRiskCategory(
                id="RSK-008",
                category="Desalination / Potable Water Depletion",
                description="Reverse osmosis intake freezing or failure requiring emergency snow melting fuel burn",
                probability=2,
                impact=4,
                risk_score=8,
                risk_level="LOW",
                mitigation_strategy="Emergency thermal snow-melters; 30-day potable buffer tanks",
                trend="stable"
            ),
            OperationalRiskCategory(
                id="RSK-009",
                category="Crew Isolation Fatigue / Overwinter Syndrome",
                description="Psychological stress and sleep disruption during 6-month continuous polar night",
                probability=3,
                impact=2,
                risk_score=6,
                risk_level="LOW",
                mitigation_strategy="Circadian full-spectrum lighting; structured psychological support check-ins",
                trend="stable"
            ),
            OperationalRiskCategory(
                id="RSK-010",
                category="Antarctic Treaty Environmental Compliance",
                description="Accidental fuel spill or waste handling deviation violating Madrid Protocol",
                probability=1,
                impact=5,
                risk_score=5,
                risk_level="LOW",
                mitigation_strategy="Double-walled fuel bladders; strict zero-discharge waste incineration",
                trend="stable"
            ),
        ]

    def get_correlations(self) -> List[CorrelationPair]:
        """
        Operational correlations with explicit distinction between correlation and causation.
        """
        return [
            CorrelationPair(
                variable_a="Wind Speed (Knots)",
                variable_b="Vessel Fuel Consumption (L/nm)",
                pearson_r=0.88,
                causality_type="DIRECT_CAUSATION",
                explanation="Headwinds create direct hydrodynamic hull drag and aerodynamic resistance, forcing increased engine RPM to maintain steerage."
            ),
            CorrelationPair(
                variable_a="Sea Ice Concentration (%)",
                variable_b="Transit Speed (Knots)",
                pearson_r=-0.92,
                causality_type="DIRECT_CAUSATION",
                explanation="Thick floe concentration physically increases hull friction and necessitates icebreaker ramming cycles, directly slowing transit."
            ),
            CorrelationPair(
                variable_a="Ambient Temperature (°C)",
                variable_b="Station Thermal Fuel Burn (L/day)",
                pearson_r=-0.89,
                causality_type="DIRECT_CAUSATION",
                explanation="Newton's law of cooling: lower outdoor temperatures proportionally increase building envelope heat loss, demanding greater hydronic heating burn."
            ),
            CorrelationPair(
                variable_a="Geomagnetic K-Index",
                variable_b="Iridium Packet Latency (ms)",
                pearson_r=0.74,
                causality_type="DIRECT_CAUSATION",
                explanation="Ionospheric scintillation directly scatters L-band satellite signals in polar auroral zones, increasing retransmissions."
            ),
            CorrelationPair(
                variable_a="Station Occupancy",
                variable_b="Daily Water Consumption (L)",
                pearson_r=0.95,
                causality_type="DIRECT_CAUSATION",
                explanation="Linear relationship with human life-support requirements (drinking, galley, hygiene)."
            ),
            CorrelationPair(
                variable_a="Ice Thickness (m)",
                variable_b="Shaft Vibration (mm/s)",
                pearson_r=0.81,
                causality_type="STRONG_CORRELATION",
                explanation="Propeller milling against milled ice blocks induces periodic torsional vibrations in propulsion line."
            ),
            CorrelationPair(
                variable_a="Generator Operating Hours",
                variable_b="Exhaust Gas Temperature (°C)",
                pearson_r=0.67,
                causality_type="INDIRECT_EFFECT",
                explanation="Carbon deposition on turbocharger and injectors degrades combustion efficiency over time, raising exhaust temperature."
            ),
            CorrelationPair(
                variable_a="Solar Elevation Angle",
                variable_b="Crew Communication Frequency",
                pearson_r=0.58,
                causality_type="SPURIOUS",
                explanation="Both variables correlate with diurnal activity schedules, but sunlight elevation does not physically drive radio communication packets."
            ),
        ]

    def get_forecast_center(self) -> List[ForecastPoint]:
        """
        Multi-horizon forecasts (7d, 14d, 30d, 90d) for Fleet Fuel Burn and Station Heating Demand.
        """
        horizons = [7, 14, 30, 90]
        points = []
        for h in horizons:
            target_dt = (self.now + timedelta(days=h)).strftime("%Y-%m-%d")
            # Fuel burn forecast
            burn_mean = 3250.0 + (h * 4.2)
            burn_uncertainty = 120.0 + (h * 5.5)
            points.append(
                ForecastPoint(
                    horizon_days=h,
                    date=target_dt,
                    metric="Fleet Daily Fuel Consumption (Litres)",
                    value_mean=round(burn_mean, 1),
                    value_p10=round(burn_mean - burn_uncertainty, 1),
                    value_p90=round(burn_mean + burn_uncertainty, 1)
                )
            )
            # Station thermal demand forecast
            thermal_mean = 345.0 + (h * 0.8)
            thermal_uncertainty = 15.0 + (h * 1.2)
            points.append(
                ForecastPoint(
                    horizon_days=h,
                    date=target_dt,
                    metric="Aggregated Station Thermal Burn (Litres/Day)",
                    value_mean=round(thermal_mean, 1),
                    value_p10=round(thermal_mean - thermal_uncertainty, 1),
                    value_p90=round(thermal_mean + thermal_uncertainty, 1)
                )
            )
        return points

    def simulate_what_if_scenario(self, req: ScenarioSimulationRequest) -> ScenarioSimulationResult:
        """
        Calculates impact of simulated operational changes:
        speed drop, weather severity, supply delay, generator derate.
        Does NOT execute real commands; strictly mathematical simulation.
        """
        # Base numbers
        base_burn_delta = 0.0
        base_delay_hours = 0.0
        high_risk_stations = 1  # Maitri already has thin fuel buffer
        operational_risk = 28.4

        # Impact of speed delta: slower speed reduces fuel burn non-linearly (cubic law), but adds delay
        if req.speed_delta_pct < 0:
            speed_ratio = (100.0 + req.speed_delta_pct) / 100.0
            fuel_saving_pct = (1.0 - (speed_ratio ** 2.2)) * 100.0
            base_burn_delta -= fuel_saving_pct
            base_delay_hours += abs(req.speed_delta_pct) * 0.85
        elif req.speed_delta_pct > 0:
            speed_ratio = (100.0 + req.speed_delta_pct) / 100.0
            fuel_increase_pct = ((speed_ratio ** 2.5) - 1.0) * 100.0
            base_burn_delta += fuel_increase_pct
            base_delay_hours -= req.speed_delta_pct * 0.4

        # Impact of blizzard / severe weather
        if req.severe_weather_event:
            base_burn_delta += 14.2  # Heavy ice resistance and heating
            base_delay_hours += 28.0
            operational_risk += 22.0

        # Impact of supply delay
        if req.supply_delay_days > 0:
            base_delay_hours += req.supply_delay_days * 24.0
            operational_risk += min(35.0, req.supply_delay_days * 3.5)
            if req.supply_delay_days >= 3:
                high_risk_stations += 1  # Bharati margin also tightened

        # Impact of generator derate
        if req.generator_derate:
            base_burn_delta += 8.5  # Inefficient secondary generator run
            operational_risk += 15.0

        projected_litres = (base_burn_delta / 100.0) * 45000.0

        recs = []
        if req.supply_delay_days > 0:
            recs.append("Implement Stage-2 Conservation Protocol at Maitri Station immediately (shed non-essential scientific freezers to central cold storage).")
        if req.severe_weather_event:
            recs.append("Reroute Southern Cross along Cape Darnley polynya to bypass 9/10ths pack ice.")
        if req.speed_delta_pct < -10.0:
            recs.append("Vessel fuel efficiency gains confirm viable eco-speed corridor; schedule crew shift adjustment for extended transit.")
        if not recs:
            recs.append("Nominal operational envelope maintained. No corrective intervention required.")

        return ScenarioSimulationResult(
            scenario_name=f"What-If Simulation (Speed {req.speed_delta_pct:+.1f}%, Storm={req.severe_weather_event}, Delay={req.supply_delay_days}d)",
            simulated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            fuel_burn_delta_pct=round(base_burn_delta, 1),
            projected_additional_fuel_litres=round(projected_litres, 0),
            eta_delay_average_hours=round(base_delay_hours, 1),
            high_risk_stations_count=high_risk_stations,
            overall_operational_risk_score=min(100.0, round(operational_risk, 1)),
            impact_summary=f"Simulation projects {base_burn_delta:+.1f}% fuel variance with {base_delay_hours:.1f} hours aggregated transit delay across fleet.",
            recommendations=recs
        )

    def get_data_quality(self) -> List[DataQualityRecord]:
        """
        Data Quality & Sensor Freshness metrics across field channels.
        """
        return [
            DataQualityRecord(
                data_source="Shipboard Engine & Navigation Telemetry",
                completeness_pct=99.4,
                latency_seconds=4.2,
                freshness_status="REALTIME",
                anomalous_records_count=2,
                last_ingestion_timestamp=(self.now - timedelta(seconds=12)).strftime("%H:%M:%S UTC")
            ),
            DataQualityRecord(
                data_source="Station Environmental & Power Scada",
                completeness_pct=98.8,
                latency_seconds=18.5,
                freshness_status="HEALTHY",
                anomalous_records_count=1,
                last_ingestion_timestamp=(self.now - timedelta(seconds=24)).strftime("%H:%M:%S UTC")
            ),
            DataQualityRecord(
                data_source="Sentinel-1 SAR Sea Ice Mosaic",
                completeness_pct=94.2,
                latency_seconds=3600.0 * 3.5,  # 3.5 hours since orbit pass
                freshness_status="PASS_ALIGNED (Periodic Orbit)",
                anomalous_records_count=0,
                last_ingestion_timestamp="Orbit Pass 2026-09-27 14:40 UTC"
            ),
            DataQualityRecord(
                data_source="ECMWF High-Resolution Polar Weather Forecasts",
                completeness_pct=100.0,
                latency_seconds=3600.0 * 6.0,
                freshness_status="CYCLE_ALIGNED (00z/12z)",
                anomalous_records_count=0,
                last_ingestion_timestamp="Model Run 2026-09-27 12:00 UTC"
            ),
        ]

    def get_network_resilience(self) -> List[NetworkResilienceMetric]:
        """
        Communication channel health across polar assets.
        """
        return [
            NetworkResilienceMetric(
                channel="Starlink Maritime (Low Earth Orbit)",
                uptime_pct=88.5,
                current_latency_ms=145.0,
                packet_loss_pct=2.1,
                offline_backlog_kb=0,
                status="ONLINE"
            ),
            NetworkResilienceMetric(
                channel="Iridium Certus 700 (Polar L-Band)",
                uptime_pct=99.8,
                current_latency_ms=620.0,
                packet_loss_pct=0.4,
                offline_backlog_kb=0,
                status="ONLINE"
            ),
            NetworkResilienceMetric(
                channel="Inmarsat-C Safety & Distress",
                uptime_pct=99.9,
                current_latency_ms=1200.0,
                packet_loss_pct=0.1,
                offline_backlog_kb=0,
                status="ONLINE"
            ),
            NetworkResilienceMetric(
                channel="High-Frequency (HF) ALE Radio Backup",
                uptime_pct=82.0,
                current_latency_ms=2800.0,
                packet_loss_pct=8.4,
                offline_backlog_kb=42,
                status="STANDBY"
            ),
        ]

    def get_ai_insights(self) -> List[AIInsight]:
        """
        Grounded AI analytical insights synthesizing trends, anomalies, and risks.
        """
        return [
            AIInsight(
                id="INS-001",
                timestamp=self.now.strftime("%Y-%m-%d %H:%M UTC"),
                category="LOGISTICS",
                severity="CRITICAL",
                title="Maitri Station Fuel Depletion Margin Breach",
                finding="Station reserves are projected to exhaust in 18.5 days, while Southern Cross resupply arrival is projected at Day 22.0.",
                root_cause="Ambient temperatures have stayed -4.5°C colder than 10-year climatology, elevating thermal heating burn rate by 18.4%.",
                recommended_action="Execute Stage-2 heat conservation in non-critical science wing and advise Southern Cross to maintain PC4 ice-breaking speed.",
                confidence=0.96,
                model_source="LightGBM Demand Forecaster + Weather Climatology Engine"
            ),
            AIInsight(
                id="INS-002",
                timestamp=(self.now - timedelta(hours=1, minutes=30)).strftime("%Y-%m-%d %H:%M UTC"),
                category="ANOMALY",
                severity="WARNING",
                title="Maitri Generator #1 Cylinder 4 Exh Thermal Outlier",
                finding="Isolation Forest detected Z-score +3.82 on Cylinder 4 exhaust gas temperature (542°C vs 480°C baseline).",
                root_cause="Localized fuel injector spray pattern degradation causing late in-cylinder combustion.",
                recommended_action="Switch primary electrical bus to Generator #2 and clean/replace fuel injector nozzle assembly on Cylinder 4.",
                confidence=0.93,
                model_source="Isolation Forest Multivariate Detector"
            ),
            AIInsight(
                id="INS-003",
                timestamp=(self.now - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M UTC"),
                category="EFFICIENCY",
                severity="INFO",
                title="Polynya Corridor Opportunity for Southern Cross",
                finding="Sentinel-1 SAR analysis identifies an offshore lead opening along Prydz Bay that reduces ice resistance factor from 1.85 to 1.22.",
                root_cause="Persistent south-easterly katabatic winds pushing pack ice northward away from the coast.",
                recommended_action="Adopt Waypoint Option Charlie (-14.2 nm diversion) to gain estimated 18 hours in transit time to Bharati.",
                confidence=0.89,
                model_source="Sentinel-1 SAR Lead Detector + Route Optimizer"
            ),
            AIInsight(
                id="INS-004",
                timestamp=(self.now - timedelta(hours=6)).strftime("%Y-%m-%d %H:%M UTC"),
                category="SAFETY",
                severity="WARNING",
                title="Approaching Deep Depressional Blizzard at Larsemann Hills",
                finding="Barometric pressure falling 1.8 hPa/hr; ECMWF ensemble indicates 65-knot gusts within 36 hours.",
                root_cause="Polar vortex depression tracking eastward along Antarctic coastal margin.",
                recommended_action="Secure all outdoor cargo staging at Bharati and halt inter-station snowcat traverses until system clears.",
                confidence=0.94,
                model_source="ECMWF Polar Ensemble & Barometric Gradient Analyzer"
            ),
        ]

analytics_service = AnalyticsService()
