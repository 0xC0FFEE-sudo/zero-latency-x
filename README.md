# ZeroLatency-X (ZL-X)

An AI-driven trading system with nanosecond-grade execution.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)]

## Architecture

ZeroLatency-X is a modular trading platform optimized for ultra-low latency. It consists of:

- **zl_chain**: Custom Layer-1 blockchain (Rust + eBPF).
- **data_ingest**: Edge data ingestion (Rust + C).
- **ai_preprocess**: AI preprocessing service (Python + Kafka).
- **strategy_engine**: Strategy engine (Go + Kafka).
- **matching_engine**: Matching engine (C++).
- **execution_api**: Order execution API (Go).
- **ui**: Web frontend (TypeScript + React + Vite).
- **config**: Network and PTPv2 configurations.

## Prerequisites

- Docker & Docker Compose
- Go 1.20+
- Rust (for local builds)
- Node.js & npm (for UI)

## Quick Start

```bash
git clone https://github.com/0xC0FFEE-sudo/zero-latency-x.git
cd zero-latency-x
docker-compose up -d zookeeper kafka redis \
  ai_preprocess strategy_engine matching_engine \
  execution_api ui
```

This will spin up all core services. Verify via logs:

```bash
docker-compose logs --follow ai_preprocess
docker-compose logs --follow strategy_engine
```

## Configuration

Environment variables (set in `docker-compose.yml` by default):

- `KAFKA_BROKERS` (default: kafka:9092)
- `RAW_TICKS_TOPIC` (default: rawticks)
- `SENTIMENT_TOPIC` (default: sentiment)
- `ORDERS_TOPIC` (default: orders)
- `REDIS_ADDR` (default: redis:6379)

## Development on MacBook

You can develop and run the full stack locally on macOS (Intel or Apple Silicon) with Docker Desktop:

- All services run as Linux containers under Docker Desktop on your Mac.
- **AI Pre-processor** uses PyTorch MPS (for Apple Silicon GPUs) or CPU fallback:
  ```bash
  export PYTORCH_ENABLE_MPS_FALLBACK=1
  ```
- Optionally use [Docker Model Runner](https://github.com/philperf/launch) for seamless LLM GPU support.
- **FPGA/ASIC** components can be stubbed by software libraries (e.g., Rust regex for Cornami chips).
- **PTPv2 / Atomic clocks** simulated via host time or NTP in containers.
- Networking over your Mac’s Wi-Fi/Ethernet simulates 5G/Edge links (ms-scale latency).

## Testing

End-to-end tests are in the `tests/` directory. Run them with:

```bash
bash tests/e2e_test.sh
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
