use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: i64,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Option {
    pub id: i64,
    pub symbol: String,
    pub option_type: String,
    pub strike: f64,
    pub expiration: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OptionOwnership {
    pub user_id: i64,
    pub option_id: i64,
    pub quantity: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MatrixView {
    pub users: Vec<User>,
    pub rows: Vec<MatrixRow>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MatrixRow {
    pub option: Option,
    pub quantities: Vec<i64>,
}
