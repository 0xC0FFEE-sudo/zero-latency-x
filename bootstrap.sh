#!/usr/bin/env bash
set -e

# Bootstrap script for ZL-X project structure
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Creating Rust crates..."
cargo new "$BASE_DIR/zl_chain" --bin
cargo new "$BASE_DIR/data_ingest" --bin

echo "Creating Python preprocess directories..."
mkdir -p "$BASE_DIR/ai_preprocess/proto" "$BASE_DIR/ai_preprocess/src"

echo "Initializing Go modules with fallback if go missing"
mkdir -p "$BASE_DIR/strategy_engine/cmd/engine" "$BASE_DIR/execution_api/src"
if command -v go >/dev/null; then
  (cd "$BASE_DIR/strategy_engine" && go mod init github.com/yourorg/strategy_engine)
  (cd "$BASE_DIR/execution_api" && go mod init github.com/yourorg/execution_api)
else
  echo "go not found, scaffolding go.mod manually"
  cat > "$BASE_DIR/strategy_engine/go.mod" <<EOF
module github.com/yourorg/strategy_engine

go 1.20
EOF
  cat > "$BASE_DIR/execution_api/go.mod" <<EOF
module github.com/yourorg/execution_api

go 1.20
EOF
fi

echo "Creating C++ matching engine dirs..."
mkdir -p "$BASE_DIR/matching_engine/src"

echo "Setting up UI scaffold..."
mkdir -p "$BASE_DIR/ui/src"

echo "Creating config directories..."
mkdir -p "$BASE_DIR/config"

echo "Bootstrap complete. Proceed to add source files per the architecture plan."
