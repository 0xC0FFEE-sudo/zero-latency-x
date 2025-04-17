module github.com/yourorg/strategy_engine

go 1.20

require (
	github.com/segmentio/kafka-go v0.4.31
	github.com/go-redis/redis/v8 v8.11.5
)

// Local proto stubs
replace github.com/yourorg/strategy_engine/proto => ./proto
