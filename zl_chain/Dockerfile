FROM rust:1.76-slim
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN rustup toolchain install nightly && rustup default nightly
RUN cargo build --release
CMD ["./target/release/zl_chain"]
