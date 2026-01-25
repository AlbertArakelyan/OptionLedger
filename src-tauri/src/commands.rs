use crate::db::get_connection;
use crate::models::{MatrixRow, MatrixView, Option, OptionOwnership, User};
use rusqlite::params;

// User commands
#[tauri::command]
pub fn create_user(name: String) -> Result<User, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    conn.execute("INSERT INTO users (name) VALUES (?1)", params![name])
        .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(User { id, name })
}

#[tauri::command]
pub fn list_users() -> Result<Vec<User>, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, name FROM users ORDER BY id")
        .map_err(|e| e.to_string())?;

    let users = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(users)
}

#[tauri::command]
pub fn delete_user(id: i64) -> Result<(), String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM users WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

// Option commands
#[tauri::command]
pub fn create_option(
    symbol: String,
    option_type: String,
    strike: f64,
    expiration: String,
) -> Result<Option, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    if option_type != "call" && option_type != "put" {
        return Err("option_type must be 'call' or 'put'".to_string());
    }

    conn.execute(
        "INSERT INTO options (symbol, option_type, strike, expiration) VALUES (?1, ?2, ?3, ?4)",
        params![symbol, option_type, strike, expiration],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    Ok(Option {
        id,
        symbol,
        option_type,
        strike,
        expiration,
    })
}

#[tauri::command]
pub fn list_options() -> Result<Vec<Option>, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, symbol, option_type, strike, expiration FROM options ORDER BY id")
        .map_err(|e| e.to_string())?;

    let options = stmt
        .query_map([], |row| {
            Ok(Option {
                id: row.get(0)?,
                symbol: row.get(1)?,
                option_type: row.get(2)?,
                strike: row.get(3)?,
                expiration: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(options)
}

#[tauri::command]
pub fn delete_option(id: i64) -> Result<(), String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    conn.execute("DELETE FROM options WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

// Ownership commands
#[tauri::command]
pub fn set_ownership(user_id: i64, option_id: i64, quantity: i64) -> Result<(), String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    if quantity <= 0 {
        conn.execute(
            "DELETE FROM option_ownership WHERE user_id = ?1 AND option_id = ?2",
            params![user_id, option_id],
        )
        .map_err(|e| e.to_string())?;
    } else {
        conn.execute(
            "INSERT INTO option_ownership (user_id, option_id, quantity) VALUES (?1, ?2, ?3)
             ON CONFLICT(user_id, option_id) DO UPDATE SET quantity = ?3",
            params![user_id, option_id, quantity],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_ownerships() -> Result<Vec<OptionOwnership>, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT user_id, option_id, quantity FROM option_ownership ORDER BY option_id, user_id")
        .map_err(|e| e.to_string())?;

    let ownerships = stmt
        .query_map([], |row| {
            Ok(OptionOwnership {
                user_id: row.get(0)?,
                option_id: row.get(1)?,
                quantity: row.get(2)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(ownerships)
}

#[tauri::command]
pub fn get_matrix_view() -> Result<MatrixView, String> {
    let conn = get_connection().lock().map_err(|e| e.to_string())?;

    // Get all users
    let mut stmt = conn
        .prepare("SELECT id, name FROM users ORDER BY id")
        .map_err(|e| e.to_string())?;

    let users: Vec<User> = stmt
        .query_map([], |row| {
            Ok(User {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    // Get all options
    let mut stmt = conn
        .prepare("SELECT id, symbol, option_type, strike, expiration FROM options ORDER BY id")
        .map_err(|e| e.to_string())?;

    let options: Vec<Option> = stmt
        .query_map([], |row| {
            Ok(Option {
                id: row.get(0)?,
                symbol: row.get(1)?,
                option_type: row.get(2)?,
                strike: row.get(3)?,
                expiration: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    // Get all ownerships
    let mut stmt = conn
        .prepare("SELECT user_id, option_id, quantity FROM option_ownership")
        .map_err(|e| e.to_string())?;

    let ownerships: Vec<(i64, i64, i64)> = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)))
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    // Build matrix rows
    let mut rows = Vec::new();
    for option in options {
        let mut quantities = Vec::new();
        for user in &users {
            let quantity = ownerships
                .iter()
                .find(|(uid, oid, _)| *uid == user.id && *oid == option.id)
                .map(|(_, _, q)| *q)
                .unwrap_or(0);
            quantities.push(quantity);
        }
        rows.push(MatrixRow { option, quantities });
    }

    Ok(MatrixView { users, rows })
}
