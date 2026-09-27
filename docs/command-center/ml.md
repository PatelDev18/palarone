# PolarOne Command Center — Machine Learning & Explainability Architecture

## 1. Predictive ML Stack

In accordance with system design constraints, **Random Forest is strictly prohibited** from the predictive stack. The Command Center integrates the following models:

1. **XGBoost (`XGB_POLAR_ETA_v2.4`)**:
   - Predicts voyage ETA and expected delays for vessels traversing pack ice and open polar oceans.
   - Features: Current speed, design speed, distance remaining, wind shear (knots), ice concentration (AMSR2 %), ice thickness, hull ice class.
   - Output: Predicted arrival timestamp, expected delay hours, prediction confidence (e.g. 76%), 95% confidence intervals.
2. **LightGBM (`LGBM_TELEMETRY_FORECAST_v1.8`)**:
   - Forecasts station energy consumption, fuel depletion curves, and operational telecommunication link stability.
3. **Isolation Forest & Autoencoder**:
   - Unsupervised sensor anomaly detection on mechanical station telemetry (diesel generators, hydraulic leveling platforms).
4. **Google OR-Tools Constraint Optimizer (`OR_TOOLS_NAV_v9.8`)**:
   - Solves multi-waypoint polar routing to minimize fuel consumption while evading heavy pack ridges and gale zones.

---

## 2. Explainability & SHAP Decomposition

Every AI prediction presented to the operator must be explainable. The Command Center breaks down predictions into human-readable contributing factors:

```
[Why is Polar Star High Risk?]
├── Sea Ice Concentration (42%)       -> +11.2h delay (43% impact)
├── Headwind Gale Shear (34-45 kt)    -> +7.4h delay  (28% impact)
├── Reduced Hull Speed (6.2 kt)       -> +4.1h delay  (16% impact)
└── Route Pack Ridge Convergence      -> +3.8h delay  (13% impact)
Total Expected Delay: +26.5 hours (Confidence: 76%)
```

Operators can click **"Why this prediction?"** at any time to open the explainability modal, inspecting individual feature contributions without exposure to raw unparsed tensors.
