import os
import json
import logging
from kafka import KafkaConsumer, KafkaProducer
from models import load_model

def main():
    brokers = os.getenv("KAFKA_BROKERS", "kafka:9092")
    brokers_list = brokers.split(",")
    raw_topic = os.getenv("RAW_TICKS_TOPIC", "rawticks")
    sentiment_topic = os.getenv("SENTIMENT_TOPIC", "sentiment")
    consumer = KafkaConsumer(raw_topic, bootstrap_servers=brokers_list)
    producer = KafkaProducer(bootstrap_servers=brokers_list)
    model = load_model()
    logging.info(f"AI Preprocessing started: raw_topic={raw_topic}, sentiment_topic={sentiment_topic}")
    for msg in consumer:
        try:
            payload = msg.value
            data = json.loads(payload)
            symbol = data.get("symbol")
            ts = data.get("ts", None)
            sentiment = model.score(payload)
            out = {"symbol": symbol, "ts": ts, "sentiment": sentiment}
            producer.send(sentiment_topic, json.dumps(out).encode("utf-8"))
        except Exception as e:
            logging.error(f"Processing error: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
