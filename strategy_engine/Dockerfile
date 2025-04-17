FROM golang:1.20-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY . .
COPY go.mod ./
RUN go mod tidy
RUN go build -o strategy cmd/engine/main.go

FROM alpine:latest
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/strategy ./
CMD ["./strategy"]
