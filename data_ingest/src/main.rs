mod feed_binance;

use tokio::sync::mpsc;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let (tx, mut rx) = mpsc::channel::<Vec<u8>>(32);
    tokio::spawn(async move {
        feed_binance::start_binance_feed(tx).await;
    });
    println!("Starting Binance feed...");
    while let Some(raw) = rx.recv().await {
        let text = String::from_utf8_lossy(&raw);
        println!("Binance tick: {}", text);
    }
    Ok(())
}
