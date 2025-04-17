use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
}

#[derive(Serialize, Deserialize)]
pub struct Block {
    pub txns: Vec<Transaction>,
}

pub struct InMemState {
    pub blocks: Vec<Block>,
    pub utxo: HashMap<String, u64>,
}

impl InMemState {
    pub fn new() -> Self {
        Self { blocks: Vec::new(), utxo: HashMap::new() }
    }

    pub fn apply_tx(&mut self, _tx: Transaction) {
        // TODO: update in-memory state
        unimplemented!()
    }
}
