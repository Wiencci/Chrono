# AGENT BLUEPRINT: DECIMALCHRONO v2.0 RECONSTRUCTION GUIDE
## DO NOT SIMPLIFY. DO NOT OMIT CONSTRUCTS.

This blueprint is designed for high-level AI agents to reconstruct the **DECIMALCHRONO** system with 100% fidelity. It contains the exact mathematical, architectural, and visual axioms of the project.

---

## 1. THE TEMPORAL AXIOM (Decimal Core)

Standard time (Sexagesimal) must be converted using these exact ratios:
- **1 Day** = 10 Decimal Hours = 100 Decimal Minutes = 10,000 Decimal Seconds.
- **MS_PER_DAY** = 86,400,000
- **MS_PER_DEC_HOUR** = 8,640,000
- **MS_PER_DEC_MINUTE** = 86,400
- **MS_PER_DEC_SECOND** = 864

### 1.1 The Decimal Calendar
- **Year:** 10 Months.
- **Month Lengths:** `[36, 37, 36, 37, 36, 37, 36, 37, 36, {Leap?38:37}]`.
- **Week:** 9-day cycle (1..9).

---

## 2. THE TACTICAL VISUAL SYSTEM (Bento HUD)

### 2.1 Grid & Layout
- **Container:** Full-screen viewport, relative positioning, overflow hidden.
- **Architecture:** Bento-mesh (Grid/Flex mix).
- **Z-Index Layering:**
  - `z-0`: Background/Ambient scanlines.
  - `z-10`: Static HUD frame (corner accents).
  - `z-20`: Peripheral complications (Telemetry bars).
  - `z-30`: Active Module Overlay (Rendered via `ModuleRenderer`).
  - `z-40`: App Launcher (Hexagonal grid).
  - `z-50`: Central Interactive Command Button.

### 2.2 Color Profiles (THEMES)
- **Amber (Standard):** `#fbbf24` (Alpha variation for transparency).
- **Cobalt:** `#3b82f6` (Night Ops).
- **Crimson:** `#ef4444` (Combat/Stealth).
- **Emerald:** `#10b981` (Radar/Diagnostic).
- **Midnight:** `#94a3b8` (Silent Running).

---

## 3. THE SENSOR ABSTRACTION LAYER (Hardware logic)

### 3.1 Lumen Simulation (Light Sensor Fallback)
When physical `AmbientLightSensor` fails:
1. Fetch Sun Times (Rise/Set) based on Latitude/Longitude.
2. If `now` is between `rise` and `set`: Lux = `1200 * sin(daylightProgress * PI)`.
3. Apply Gaussian jitter: `(Math.random() - 0.5) * 15`.

### 3.2 Seismo-Logic
- Sample acceleration `(x, y, z)` at 60Hz.
- Calculate `magnitude = sqrt(x² + y² + z²)`.
- Subtract gravity constant (approx 9.8).
- Store 60-point buffer for real-time wave visualization.

---

## 4. ZEN PROTOCOL (Biometric Logic)

The "Resonance Ritual" follows a strictly timed 4-part cycle:
1. **Inspire:** 4s (Visual ring expands).
2. **Hold:** 4s (Visual ring pulses).
3. **Expire:** 4s (Visual ring contracts).
4. **Wait:** 4s (Visual ring remains at minimum).

State Machine: `inspire -> hold -> expire -> wait -> repeat`.

---

## 5. ASTRO-DYNAMICS (NASA Uplink)

### 5.1 Keplerian Web-Canvas
- **Scale:** 1 AU = 100 pixels.
- **Planets:** Calculate angle $\theta = (DaysSinceJ2000 / Period) * 2\pi$.
- **Orbits:** Render ellipses with `stroke-dasharray` for "Radar" effect.

### 5.2 NEO Tracker
- Fetch from `api.nasa.gov/neo/rest/v1/feed`.
- Priority Filter: If `is_potentially_hazardous_asteroid === true`, highlight in Crimson.

---

## 6. THE AUDIO ENGINE (Generative Frequencies)

- **Clock Tick:** 880Hz Sine, 0.05s duration, exponential decay.
- **Minute Change:** Phase-shifted Sawtooth sweep (440Hz -> 880Hz).
- **Alarm:** Pulse Wave 10Hz modulation over 2000Hz base.
- **Ambient Drone:** Low-pass filtered White Noise (Cutoff 200Hz).

---

## 7. AI COMMAND CENTER (LLM Integration)

### 7.1 Prompt Construct
To generate the "Tactical Briefing", send the following context to the LLM:
> "SITUACAO: Operador em campo. Bateria: {bat}%. Clima: {weather}C. Modo App: {appMode}. Logs Recentes: [{logs}]. Gere uma mensagem tática curta, robótica e autoritária, no estilo de sistema militar de combate futurista."

---

## 8. RECONSTRUCTION CHECKLIST (The Perfect HUD)

1. **Scanlines Overlay:** 2px height, 4px spacing, 0.05 opacity.
2. **Flicker Effect:** Random opacity shifts between (0.95 and 1.0) on a 0.1s interval for the entire UI.
3. **Border Accents:** Use "Square brackets" corners: `border-l-2 border-t-2 w-4 h-4`.
4. **Font:** Monospaced (Inter/JetBrains Mono).

**[ RECONSTRUCTION PARAMETERS LOCKED // OPERATOR WIENCCI APPROVAL GRANTED ]**
