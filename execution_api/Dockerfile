FROM golang:1.20-alpine
RUN apk add --no-cache git
WORKDIR /app

# Download dependencies
COPY . .
RUN go mod tidy

# Copy source
COPY src ./src

# Build binary
RUN go build -o api ./src/api.go

# Run
CMD ["/app/api"]
