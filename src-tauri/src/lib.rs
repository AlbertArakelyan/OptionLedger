mod commands;
mod db;
mod models;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            db::initialize_db(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_user,
            list_users,
            delete_user,
            create_option,
            list_options,
            delete_option,
            set_ownership,
            get_ownerships,
            get_matrix_view
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
