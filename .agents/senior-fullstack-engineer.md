You are a senior full-stack engineer and systems architect.

Create a desktop application using the following stack:
- Backend: Rust
- Desktop framework: Tauri
- Frontend: React (TypeScript)
- Database: SQLite (local file DB)
- ORM/DB layer: sqlx or rusqlite
- Architecture: local-first, no auth, no cloud, no network APIs

APP PURPOSE:
A personal desktop app to manage shared stock option ownership between multiple users using one brokerage account.

Users are just names (no authentication).
Options are option contracts.
Ownership is quantity-based per user per option.
Profit splitting will be percentage-based in the future.

DATA MODEL:

User:
- id (int, primary key)
- name (string, unique)

Option:
- id (int, primary key)
- symbol (string)
- option_type ("call" | "put")
- strike (float)
- expiration (ISO date string)

OptionOwnership:
- user_id (FK -> users.id)
- option_id (FK -> options.id)
- quantity (int)
- composite primary key (user_id, option_id)

SQLITE SCHEMA MUST BE CREATED ON APP INIT.

FEATURES:

Backend (Rust + Tauri commands):
- create_user(name)
- list_users()
- delete_user(id)

- create_option(symbol, type, strike, expiration)
- list_options()
- delete_option(id)

- set_ownership(user_id, option_id, quantity)
- get_ownerships()

- get_matrix_view():
  returns data structured for a table where:
  rows = options
  columns = users
  cells = quantity per user per option

Frontend (React):
Pages / Views:
1. Users Manager
   - Add user
   - List users

2. Options Manager
   - Add option contract
   - List options

3. Ownership Editor
   - Select option
   - Assign quantities per user

4. Matrix View
   - Table:
     rows = options
     columns = users
     values = quantities
   - First column = option descriptor (symbol, strike, type, expiration)

UI requirements:
- simple
- data-dense
- table-based
- no animations
- no auth
- no theming complexity

ARCHITECTURE RULES:
- All data stored in local SQLite file
- No network calls
- No external APIs
- No cloud sync
- No authentication
- No encryption
- No overengineering
- No Redux (use React state/context)
- No server

TAURI RULES:
- Use invoke() API
- All DB access via Rust
- Rust is source of truth
- Frontend is dumb renderer

PROJECT STRUCTURE:
- src-tauri/
  - db.rs
  - models.rs
  - commands.rs
  - main.rs
- src/
  - components/
  - pages/
  - App.tsx
  - api.ts (tauri invoke wrappers)

REQUIREMENTS:
- TypeScript frontend
- Strong typing
- Clean separation of concerns
- Deterministic DB schema
- Idempotent DB init
- Error handling
- Minimal dependencies
- No magic frameworks

OUTPUT:
1) Initialize Tauri project
2) Create SQLite integration
3) Create schema
4) Create Rust models
5) Create Rust commands
6) Wire Tauri invoke layer
7) Create React pages
8) Create Matrix View table
9) Provide run instructions
10) Provide build instructions

Goal:
A working local-first desktop app that allows:
- creating users
- creating options
- assigning ownership
- viewing aggregated ownership matrix

No placeholders. No pseudocode. Real code. Runnable project.
