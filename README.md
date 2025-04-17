# ZeroLatency-X (ZL-X)

An AI-Driven Trading System with Nanosecond-Grade Execution.

## Modules
- `zl_chain` : Custom Layer-1 blockchain (Rust + eBPF)
- `data_ingest` : Edge data ingestion (Rust + C)
- `ai_preprocess` : LLM pre-filtering (Python + gRPC)
- `strategy_engine` : Micro-strategy engine (Go)
- `matching_engine` : FPGA-based matcher (C++)
- `execution_api` : Order signing & submission (Go)
- `ui` : WebAssembly frontend (TypeScript + React)
- `config` : Network & PTPv2 configs

Refer to each directory’s README for setup instructions.
