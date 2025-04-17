package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/segmentio/kafka-go"
	"github.com/go-redis/redis/v8"
)

type SentimentTick struct {
	Symbol    string  `json:"symbol"`
	Ts        int64   `json:"ts"`
	Sentiment float64 `json:"sentiment"`
}

type Order struct {
	Symbol string  `json:"symbol"`
	Side   string  `json:"side"`
	Qty    float64 `json:"qty"`
}

func main() {
	ctx := context.Background()

	// Kafka consumer for sentiment ticks
	brokers := strings.Split(os.Getenv("KAFKA_BROKERS"), ",")
	sentimentTopic := os.Getenv("SENTIMENT_TOPIC")
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		Topic:   sentimentTopic,
		GroupID: "strategy-engine",
	})
	defer reader.Close()

	// Kafka writer for orders
	ordersTopic := os.Getenv("ORDERS_TOPIC")
	writer := kafka.NewWriter(kafka.WriterConfig{
		Brokers: brokers,
		Topic:   ordersTopic,
		Balancer: &kafka.LeastBytes{},
	})
	defer writer.Close()

	// Redis client (if needed)
	rdb := redis.NewClient(&redis.Options{Addr: os.Getenv("REDIS_ADDR")})
	defer rdb.Close()

	log.Println("Strategy engine started")

	for {
		m, err := reader.ReadMessage(ctx)
		if err != nil {
			log.Println("Error reading sentiment:", err)
			continue
		}
		var tick SentimentTick
		if err := json.Unmarshal(m.Value, &tick); err != nil {
			log.Println("Invalid sentiment format:", err)
			continue
		}

		// Thresholds
		buyThreshold := 0.5
		if val := os.Getenv("BUY_THRESHOLD"); val != "" {
			if f, err := strconv.ParseFloat(val, 64); err == nil {
				buyThreshold = f
			}
		}
		sellThreshold := 0.3
		if val := os.Getenv("SELL_THRESHOLD"); val != "" {
			if f, err := strconv.ParseFloat(val, 64); err == nil {
				sellThreshold = f
			}
		}

		if tick.Sentiment >= buyThreshold {
			order := Order{Symbol: tick.Symbol, Side: "BUY", Qty: 1.0}
			log.Printf("Emitting order: %+v", order)
			msgBytes, _ := json.Marshal(order)
			writer.WriteMessages(ctx, kafka.Message{Key: []byte(order.Symbol), Value: msgBytes, Time: time.Now()})
		} else if tick.Sentiment <= sellThreshold {
			order := Order{Symbol: tick.Symbol, Side: "SELL", Qty: 1.0}
			log.Printf("Emitting order: %+v", order)
			msgBytes, _ := json.Marshal(order)
			writer.WriteMessages(ctx, kafka.Message{Key: []byte(order.Symbol), Value: msgBytes, Time: time.Now()})
		}
	}
}
