# OptionLedger

A local-first desktop application for managing shared stock option ownership between multiple users using one brokerage account.

## Features

- User management (create, list, delete)
- Options management (create, list, delete)
- Ownership assignment (quantity per user per option)
- Matrix view (aggregated ownership table)

## Stack

- **Backend**: Rust
- **Desktop Framework**: Tauri
- **Frontend**: React (TypeScript)
- **Database**: SQLite (local file)
- **ORM**: rusqlite

## Prerequisites

- Node.js 18+ and yarn
- Rust (latest stable)
- System dependencies for Tauri (see https://tauri.app/start/prerequisites/)

## Run Instructions

1. Install dependencies:
```bash
yarn install
```

2. Run in development mode:
```bash
yarn tauri dev
```

The app will compile Rust backend and launch the desktop application.

## Build Instructions

Build a production executable:

```bash
yarn tauri build
```

The compiled application will be in `src-tauri/target/release/bundle/`.

## Architecture

- **No authentication**: Users are just names
- **No network**: All data stored locally in SQLite
- **No cloud sync**: Local-first architecture
- **Clean separation**: Rust handles all database operations, React is a dumb renderer

## Data Model

- **User**: id, name (unique)
- **Option**: id, symbol, option_type (call/put), strike, expiration
- **OptionOwnership**: user_id, option_id, quantity (composite PK)

## Database Location

SQLite database is stored in the platform-specific app data directory:
- Windows: `%APPDATA%/com.albertarakelyan.optionledger/optionledger.db`
- macOS: `~/Library/Application Support/com.albertarakelyan.optionledger/optionledger.db`
- Linux: `~/.local/share/com.albertarakelyan.optionledger/optionledger.db`

