use once_cell::sync::OnceCell;
use rusqlite::{Connection, Result};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

static DB: OnceCell<Mutex<Connection>> = OnceCell::new();

pub fn initialize_db(app: &AppHandle) -> Result<()> {
    let app_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data dir");
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data dir");
    
    let db_path = app_dir.join("optionledger.db");
    let conn = Connection::open(db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            option_type TEXT NOT NULL CHECK(option_type IN ('call', 'put')),
            strike REAL NOT NULL,
            expiration TEXT NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS option_ownership (
            user_id INTEGER NOT NULL,
            option_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            PRIMARY KEY (user_id, option_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE
        )",
        [],
    )?;

    DB.set(Mutex::new(conn))
        .expect("Database already initialized");

    Ok(())
}

pub fn get_connection() -> &'static Mutex<Connection> {
    DB.get().expect("Database not initialized")
}
