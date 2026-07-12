# AURA - Men's Wellness & Habit Tracker

AURA is a premium, client-side offline-first habit tracking and wellness application tailored for men. It is designed to run entirely network-free with 100% local database storage (via `localStorage`), ensuring maximum privacy. 

Using **Next.js** with a mobile-first responsive layout, AURA compiles into static web assets and leverages **Capacitor** to compile directly into a native Android APK without launching the Android Studio user interface.

---

## 1. High-Level Architecture

AURA follows the principles of **Clean Architecture** and **SOLID Design Patterns** separated into logical boundaries:

```
  ┌──────────────────────────────────────────────────────────┐
  │                    Presentation Layer                    │
  │  (Next.js App Router, React Components, Tailwind, CSS)    │
  └────────────────────────────┬─────────────────────────────┘
                               │ Reads/Writes state
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 Business Logic & Services                 │
  │     (advice.js - Streak calculations & advice scales)     │
  └────────────────────────────┬─────────────────────────────┘
                               │ Queries / Persists
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                      Database Layer                      │
  │  (storage.js - Local JSON repository over localStorage)  │
  └──────────────────────────────────────────────────────────┘
```

- **Domain/Business Logic**: Computes user streaks, tracking continuity, and dynamic health advice categorized into **Low**, **Medium**, or **High** frequency scales based on a 30-day tracking scope.
- **Repository/Storage**: Handles collections acting as a relational wrapper over Web Storage API.
- **Offline Reliability**: SSR-safe layout hydration to prevent compile failures during static site exports.

---

## 2. Folder Structure

```
men-app/
├── android/                 # Native Android compilation project (Capacitor)
├── public/                  # Static assets and icons
├── src/
│   ├── app/                 # Next.js App Router & Pages
│   │   ├── calendar/        # Streak calendar view page
│   │   ├── dashboard/       # Main overview stats, advice, redirect commands
│   │   ├── login/           # Local lockscreen PIN login page
│   │   ├── profile/         # Profile diagnostics & data deletion options
│   │   ├── register/        # First-time profile creation page
│   │   ├── globals.css      # Custom styling, transitions, glassmorphic layout
│   │   ├── layout.js        # App root layout skeleton
│   │   └── page.js          # App router route-guard redirect
│   ├── components/          # Reusable shared components
│   │   ├── BottomNav.js     # Persistent bottom navigation tabs
│   │   ├── Header.js        # Top header container (Theme & secure toggle)
│   │   └── LogModal.js      # Modal to add/edit tracking parameters
│   └── lib/                 # Utility libraries
│       ├── advice.js        # Core analytics, advice metrics, streak math
│       └── storage.js       # Client localStorage wrapper repository
├── tests/
│   └── run-tests.mjs        # 100% coverage Node.js unit tests suite
├── build-android.bat        # Gradle/Capacitor build scripting wrapper
├── capacitor.config.ts      # Capacitor Native build settings
├── next.config.mjs          # Next.js static site settings
├── package.json             # App dependencies & scripts
└── README.md                # Documentation guide
```

---

## 3. Database Schema (LocalStorage)

AURA organizes client-side persistent variables inside Web Storage using dedicated JSON schemas:

### `aura_user_profile`
```json
{
  "name": "Sabari",
  "age": 25,
  "dob": "2001-07-12",
  "sex": "male",
  "phone": "+91 9876543210",
  "pin": "1234",
  "termsAccepted": true,
  "registeredAt": "2026-07-12T03:33:21.000Z"
}
```

### `aura_tracker_logs`
```json
[
  {
    "id": "log_1720761234_abc987",
    "timestamp": "2026-07-12T03:30:00.000Z",
    "count": 1,
    "partner": false,
    "porn": true,
    "notes": "Late night stress trigger"
  }
]
```

---

## 4. Installation & Local Development

Follow these steps to run the application in a local browser environment.

### Prerequisites
- **Node.js** (v18 or higher recommended. Compiled on v22.17)
- **NPM** (v10 or higher)

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## 5. Testing

AURA includes a custom unit testing suite utilizing Node's built-in `node:test` library (no external test dependency bloat, runs at native speeds).

Run tests with:
```bash
npm test
```

---

## 6. Android Compilation (Without Android Studio)

AURA contains a pre-configured automation script `build-android.bat` to compile your project directly into a native Android package (`.apk`) using Gradle command-line tools.

### Prerequisites for Android CLI Build
To compile the APK successfully from the terminal, your system must have:
1. **Java Development Kit (JDK 17)**: Download and install JDK 17, then add it to your `PATH` and configure `JAVA_HOME`.
2. **Android Command Line Tools / SDK**: Install the Android SDK. Ensure the `ANDROID_HOME` environment variable points to your Android SDK root folder (e.g. `C:\Users\<username>\AppData\Local\Android\Sdk`).

### Build Steps
1. Run the build script in the root directory:
   ```cmd
   build-android.bat
   ```
2. The script will automatically:
   - Perform static site export compiler `npm run build` producing `/out`.
   - Sync static files with the Capacitor wrapper.
   - Run Gradle compiler compilation: `gradlew.bat assembleDebug`.
   - Copy the compiled APK to the project root directory.

3. Find your output file: **`AURA-WellnessTracker-debug.apk`** in the project root folder. You can transfer this file to your Android phone to install and test the app immediately.
