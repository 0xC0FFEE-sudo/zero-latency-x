use warp::Filter;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use zl_chain::storage::InMemState;
use zl_chain::consensus::ZLAConsensus;
use std::convert::Infallible;
use std::sync::Arc;

#[derive(Deserialize, Clone)]
struct RpcRequest { method: String, params: Vec<Value> }

#[derive(Serialize)]
struct RpcResponse { result: Value, error: Option<String> }

// Shareable filters for state and consensus
fn with_state(state: Arc<InMemState>) -> impl Filter<Extract = (Arc<InMemState>,), Error = Infallible> + Clone {
    warp::any().map(move || state.clone())
}
fn with_consensus(consensus: Arc<ZLAConsensus>) -> impl Filter<Extract = (Arc<ZLAConsensus>,), Error = Infallible> + Clone {
    warp::any().map(move || consensus.clone())
}

#[tokio::main]
async fn main() {
    // Initialize shared state and consensus
    let state = Arc::new(InMemState::new());
    let consensus = Arc::new(ZLAConsensus {});

    // RPC endpoint: POST /rpc
    let rpc = warp::path("rpc")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_state(state.clone()))
        .and(with_consensus(consensus.clone()))
        .map(|req: RpcRequest, state: Arc<InMemState>, consensus: Arc<ZLAConsensus>| {
            let resp = handle_rpc(req, &*state, &*consensus);
            warp::reply::json(&resp)
        });

    warp::serve(rpc).run(([0, 0, 0, 0], 8545)).await;
}

fn handle_rpc(req: RpcRequest, _state: &InMemState, _consensus: &ZLAConsensus) -> RpcResponse {
    match req.method.as_str() {
        "propose_block" => RpcResponse { result: json!({"status":"ok"}), error: None },
        _ => RpcResponse { result: json!(null), error: Some("Unknown method".into()) },
    }
}
