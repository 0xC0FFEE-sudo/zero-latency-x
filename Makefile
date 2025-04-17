.PHONY: all chain ingest strategy match execution ui clean

all: chain ingest

chain:
	cd zl_chain && cargo build

ingest:
	cd data_ingest && cargo build

ai:
	@echo "Skipping local ai build; use Docker Compose to build ai_preprocess service"

strategy:
	@echo "Skipping local strategy build; use Docker Compose to build and run."

match:
	@echo "Skipping local matching_engine build; use Docker Compose to build and run."

execution:
	@echo "Skipping local execution_api build; use Docker Compose to build and run."

ui:
	@echo "Skipping local UI build; use Docker Compose to build and run."

clean:
	cd zl_chain && cargo clean; \
	cd data_ingest && cargo clean; \
	cd strategy_engine && go clean; \
	cd matching_engine/build && make clean; \
	cd execution_api && go clean; \
	cd ui && rm -rf node_modules dist; \
	rm -rf ai_preprocess/__pycache__
