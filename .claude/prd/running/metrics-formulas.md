## 14. Computed Metrics Formulas

### Training Stress Score (rTSS)

```
rTSS = (duration_sec × NGS × IF) / (threshold_pace × 3600) × 100
NGS  = avg pace (simplified)
IF   = avg_pace / threshold_pace
```

### TRIMP (HR-based alternative)

```
TRIMP = duration_min × HRr × 0.64 × e^(1.92 × HRr)
HRr   = (avg_hr - resting_hr) / (max_hr - resting_hr)
```

### ACWR

```
ACWR = avg_load_last_7d / avg_load_last_28d
Optimal: 0.8 – 1.3
Warning: 1.3 – 1.5
Danger:  > 1.5 (injury risk increases significantly)
```

### Race predictor (Riegel formula)

```
T2 = T1 × (D2 / D1)^1.06
Example: 5K PR 22:45 → Half marathon ≈ 1:47:xx
```

### VO2max estimation

```
From PR and distance: use VDOT lookup table (Jack Daniels methodology)
From HR + pace: use Firstbeat approximation
```

---
