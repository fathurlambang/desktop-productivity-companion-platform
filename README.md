# Focus Companion

A lightweight, privacy-first desktop productivity companion application designed with the **Swiss / International Style**. Focus Companion integrates essential productivity tools directly into your desktop environment, running entirely offline with a local SQLite database.

## Features

- **Pomodoro Timer**: A customizable timer that integrates directly with your macOS menu bar (Tray). 
- **Task Management**: A brutally effective, structured task list. Connect tasks to your Pomodoro sessions and track what you've accomplished.
- **Meeting Reminders**: Keep track of your upcoming events locally.
- **Desktop Companion**: A persistent tool for your daily focus needs.
- **Privacy-First**: No telemetry, no cloud sync, no tracking. All data is securely stored locally via SQLite.
- **Swiss / International Design**: Stripped of excess, the UI features strict asymmetric grids, sharp zero-radius geometry, high contrast, and a beautiful 8-color soft pastel palette.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) & [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with `vite-plugin-electron`
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) & [Drizzle ORM](https://orm.drizzle.team/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Generate and migrate the local database:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### Running the App

Start the application in development mode with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Building for Production

To package the application for your operating system:

```bash
npm run build
```

## Download & Install

### macOS (ARM64)

1. Download `Focus Companion-1.0.0-arm64.dmg` from [Releases](https://github.com/fathurlambang/desktop-productivity-companion-platform/releases)
2. Open the DMG and drag **Focus Companion** to Applications
3. **First launch:** The app is unsigned, so macOS will block it. Fix with:
   ```bash
   xattr -cr "/Applications/Focus Companion.app"
   ```
4. Open the app normally from Applications or Spotlight

> **Why this happens:** macOS Gatekeeper flags unsigned downloaded apps with a quarantine attribute. The `xattr -cr` command removes this flag.

**Alternative:** Right-click the app → Open → Click "Open" in the dialog.

## Design System

Focus Companion strictly adheres to a **Swiss / International Design System**:
- **Geometry**: Strict `0px` border radius on all elements.
- **Layout**: Asymmetric grid structures with bold, structural borders (`border-2`).
- **Typography**: Flush-left alignment, sans-serif, using uppercase for strong structural labels.
- **Motion**: Brutally fast transitions (0ms-100ms) with no slow fade-ins.
- **Color Palette**: A curated 8-color pastel scheme utilizing soft coral, mint, and dusty blue for high legibility without eye strain.

## Project Structure

- `/src`: React frontend code (Components, Hooks, Features, Store, Styles)
- `/electron`: Electron backend code (Main process, IPC handlers, Tray management)
- `/src/database`: Drizzle schema and migrations
- `/docs`: Product requirements (PRD) and architecture documentation

## License

MIT License
