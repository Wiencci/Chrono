# DECIMALCHRONO v2.0
## Tactical HUD & Decimal Temporal Core

**DECIMALCHRONO** is a high-fidelity, web-based tactical HUD designed for the transition to decimal-based measurement systems. It combines advanced temporal logic with real-time sensor telemetry and astronomical monitoring, all wrapped in a "Spaceship Cockpit" aesthetic.

![Status: Operational](https://img.shields.io/badge/Status-Operational-00ffb0?style=for-the-badge)
![UI: Tactical HUD](https://img.shields.io/badge/Interface-Tactical_HUD-blue?style=for-the-badge)
![Tech: React 19](https://img.shields.io/badge/Framework-React_19-61dafb?style=for-the-badge&logo=react)

---

## 🌌 The Concept

In a world dictated by base-60 traditions, **DECIMALCHRONO** looks forward. It redefines time, space, and biometric tracking through the lens of a unified decimal system. 

The interface is built to be a "Cockpit for your Life"—a centralized dashboard for monitoring both the micro (your breath, your steps) and the macro (solar orbits, near-earth asteroids).

---

## 🛠 Features

### 1. The Decimal Core
- **Decimal Time:** Days are divided into 10 decimal hours, 100 decimal minutes, and 100 decimal seconds.
- **Decimal Date:** A logic-based calendar where the year consists of 10 months of varying lengths (36-38 days), simplifying temporal calculations.
- **Dynamic HUD:** A central radial interface that visualizes the flow of time with sub-second precision.

### 2. Zen Protocol (Biometric Calm Sync)
- A guided breathing ritual based on the **4-4-4-4 technique** (Inspire, Hold, Expire, Wait).
- Synchronized with a visual "Breathing Ring" for neurological stabilization.
- Integrated voice guidance and tactical haptic feedback.

### 3. Astro Telemetry (NASA Integration)
- **NEO Tracker:** Real-time data uplink from NASA's API to track Near-Earth Objects and potentially hazardous asteroids.
- **Planetary Monitor:** Real-time orbital visualization of the inner solar system (Mercury, Venus, Earth, Mars).

### 4. Sensor Suite (Web API Integration)
- **EMF Detector:** Visualizes electromagnetic field interference (simulated via magnetometer where available).
- **Seismo-Monitor:** Tracks device acceleration and seismic vibration.
- **Lumen Meter:** Ambient light measurement with astronomical fallback (calculates theoretically based on sun position if sensors are unavailable).
- **Scanner Overlay:** A tactical radar sweep monitoring simulated peripheral sectors.

### 5. Tactical Briefing (Gemini AI)
- AI-generated situational reports based on current telemetry, weather, and mission logs.
- Interactive terminal for logging "Mission Actions" with persistent local storage.

---

## 🚀 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS (Utility-first tactical design)
- **Animation:** Motion (for fluid HUD transitions)
- **State Management:** Custom React Hooks for sensor decoupling.
- **Icons:** Lucide React (Tactical iconography)
- **Data:** NASA NEO API, Open-Meteo API.
- **Audio:** Web Audio API (Generative frequencies and pulses).

---

## 🔧 Installation & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/decimalchrono.git
   cd decimalchrono
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file and add your Gemini API Key if you wish to use the AI Briefing feature.
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

---

## 📐 UI Layout Philosophy

The UI follows a **Bento HUD** architecture:
- **Central Core:** Temporal and Mode selectors.
- **Lateral Panels:** Dynamic complications (Battery, GPS, Heading, Weather).
- **Overlay Modules:** Deep-focus interfaces for specific sensors.
- **Chromatic Shift:** Supports multiple tactical profiles (Amber, Cobalt, Crimson, Emerald, Midnight).

---

## ⚠️ Disclaimer

Accessing device sensors (Magnetometer, Ambient Light, Accelerometer) requires **HTTPS** and explicit user permission in modern browsers. If sensors are restricted, the HUD automatically switches to **Simulation Logic** to maintain the "Cockpit Experience."

---

*Designed for the explorers of the Decimal Age.*
**[ DECIMALCHRONO // SYSTEM ONLINE ]**
