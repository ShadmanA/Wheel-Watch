# Wheel-Watch 🚗🔒

**An AI-powered car surveillance app that turns your phone into a theft-prevention system.**

## The Problem

Car theft is fast, often silent, and usually discovered too late — after the vehicle is already gone. Traditional car alarms are easy to ignore (false alarms have trained people to tune them out), and by the time an owner notices their car is missing, there's little that can be done. Owners have no real-time visibility into who is near or inside their car, and no historical record of *where* their car has been at risk before.

## The Solution

Wheel-Watch is a mobile app paired with an on-device/edge AI pipeline that watches over a parked car and immediately alerts the owner the moment something looks wrong — a stranger's face at the wheel, the alarm going off, or the camera being covered. It combines:

- **Biometric enrollment** — the owner registers their face once, on their own phone.
- **Real-time face verification** — every time someone is detected in the driver's seat, their face is compared against the enrolled owner.
- **Liveness detection** — a blink/expression check prevents someone from spoofing the system with a photo.
- **Camera obstruction detection** — flags attempts to physically block or cover the camera.
- **Audio alarm recognition** — listens for the car's own alarm sound and notifies the owner even if they're out of earshot.
- **Instant push alerts** — the owner is notified on their phone the moment any of the above trips.
- **Theft heatmap** — a community-sourced map of previously reported theft locations, with proximity alerts when parking near a hotspot.
- **Ignition logs** — a timestamped, geotagged log of every time the car is started and turned off.

## Feature Status

| Feature | Status |
|---|---|
| Auth (Clerk: email + social sign-in) | ✅ Implemented |
| Face enrollment (capture + upload) | ✅ Implemented |
| Device registration & push notifications | ✅ Implemented |
| Theft-location map | ✅ Implemented  |
| Live camera feed screen | ✅ Implemented  |
| Face recognition agent (match vs. enrolled owner) | ✅ Implemented |
| Camera obstruction detection agent | ✅ Implemented  |
| Car alarm audio recognition agent | ✅ Implemented  |

## Architecture

Wheel-Watch is split into a **mobile client** (this repo) and a **backend/edge tier** that does anything sensitive or compute-heavy. The phone never holds API secrets and never runs face-matching against a database directly — it talks to a backend over HTTPS.

```
┌─────────────────────────────┐
│         Mobile App          │
│   Expo + React Native (TS)  │
│                              │
│  • Clerk auth                │
│  • Face capture (camera)     │
│  • Live video viewer         │
│  • Theft-location map        │
│  • Push notification receiver│
└──────────────┬───────────────┘
               │ HTTPS (Bearer token from Clerk)
               ▼
┌─────────────────────────────┐
│      Backend / Edge API      │       ┌───────────────────────────┐
│  (FastAPI-style REST API)    │──────▶│   Stream / GetStream       │
│                              │       │  Video + real-time comms  │
│  • /register-device          │       └───────────────────────────┘
│  • /enroll (face upload)     │
│  • /theft-locations           │       ┌───────────────────────────┐
│  • /devices/:id/events        │──────▶│   AI / Vision Agents       │
└──────────────┬────────────────┘       │  • Face detection          │
               │                        │  • Face recognition        │
               ▼                        │  • Liveness/blink check    │
┌─────────────────────────────┐         │  • Obstruction detection   │
│   Push Notification Service  │         │  • Alarm audio detection   │
│   (Expo Notifications)       │         └───────────────────────────┘
└─────────────────────────────┘
```

**Why split it this way?**
- **Secrets stay off the device.** Clerk session tokens are verified server-side; API keys for Stream and any AI providers live only in the backend.
- **Heavy AI inference runs off the phone** (or in a dedicated on-device model runtime), so the app stays fast and battery-friendly.
- **The mobile app is a thin client**: capture input (photos/video/audio), display alerts, and render the map — all matching, detection, and storage logic lives server-side.

> Note: The backend/edge service is a separate project from this repo. This README documents the mobile client found here.

## Tech Stack

- [Expo](https://expo.dev) + [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- React Native + TypeScript
- [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- [Clerk](https://clerk.com/) for authentication
- [Stream / GetStream](https://getstream.io/) for live video and real-time communication
- Zustand for client state, AsyncStorage for persistence
- Expo Notifications for push alerts
- `expo-file-system` for multipart face-image upload

## Project Structure

```
src/
  app/              # Expo Router screens (routes only)
    (auth)/          # sign-in / sign-up
    index.tsx        # entry/redirect screen
    onboarding.tsx
    home.tsx
    face-capture.tsx # biometric enrollment flow
    live-feed.tsx    # live camera view
    map.tsx          # theft-location map
  components/       # Reusable UI (auth fields, buttons, cards)
  constants/        # Centralized asset imports (images.ts)
  hooks/            # Custom hooks (e.g. useSocialAuth)
  lib/              # External service helpers (api.ts, notifications.ts)
  theme/            # Colors, typography
assets/             # Images, icons, fonts
app.json            # Expo app config
global.css          # Tailwind/NativeWind base styles
```

## Getting Started

### Prerequisites

- Node.js and npm
- The [Expo Go](https://expo.dev/go) app (for quick device testing) or an iOS/Android simulator
- A running instance of the Wheel-Watch backend (for the API endpoints used by `lib/api.ts`)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=   # from your Clerk dashboard
EXPO_PUBLIC_DEVICE_ID=               # unique identifier for this device/vehicle
EXPO_PUBLIC_BACKEND_URL=             # base URL of the Wheel-Watch backend API
EXPO_PUBLIC_EDGE_URL=                # base URL of the edge/AI vision service
```

### 3. Start the app

```bash
npm run start
```

Then choose to open it in a development build, Android emulator, iOS simulator, or Expo Go from the Expo CLI output.

Platform-specific shortcuts are also available:

```bash
npm run ios
npm run android
npm run web
```

### 4. Lint

```bash
npm run lint
```

## License

MIT — see [LICENSE](LICENSE).
