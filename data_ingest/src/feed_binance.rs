use tokio::sync::mpsc;
use tokio::time::{interval, Duration};
use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Deserialize, Serialize)]
struct BinanceTick { symbol: String, price: String }

pub async fn start_binance_feed(tx: mpsc::Sender<Vec<u8>>) {
    let client = reqwest::Client::new();
    let mut ticker = interval(Duration::from_secs(1));
    loop {
        ticker.tick().await;
        if let Ok(resp) = client
            .get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
            .send()
            .await
        {
            if let Ok(tick) = resp.json::<BinanceTick>().await {
                if let Ok(json) = serde_json::to_vec(&tick) {
                    if tx.send(json).await.is_err() {
                        break;
                    }
                }
            }
        }
    }
}
