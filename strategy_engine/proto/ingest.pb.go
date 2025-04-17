package proto

import (
    "context"
    "google.golang.org/grpc"
)

// RawTick is a message to send raw market data for processing.
type RawTick struct {
    Symbol  string
    Ts      int64
    Payload []byte
}

// SentimentTick is a message with a sentiment score.
type SentimentTick struct {
    Symbol    string
    Ts        int64
    Sentiment float32
}

// PreprocessorClient is the client API for Preprocessor service.
type PreprocessorClient interface {
    Filter(ctx context.Context, opts ...grpc.CallOption) (Preprocessor_FilterClient, error)
}

// NewPreprocessorClient creates a new PreprocessorClient.
func NewPreprocessorClient(cc grpc.ClientConnInterface) PreprocessorClient {
    return &preprocessorClient{cc}
}

type preprocessorClient struct {
    cc grpc.ClientConnInterface
}

// Preprocessor_FilterClient is the client interface for streaming Filter RPC.
type Preprocessor_FilterClient interface {
    Send(*RawTick) error
    Recv() (*SentimentTick, error)
    grpc.ClientStream
}

// Filter starts bidirectional streaming for RawTick and SentimentTick.
func (c *preprocessorClient) Filter(ctx context.Context, opts ...grpc.CallOption) (Preprocessor_FilterClient, error) {
    stream, err := c.cc.NewStream(ctx, &grpc.StreamDesc{
        StreamName:    "Filter",
        ServerStreams: true,
        ClientStreams: true,
    }, "/ingest.Preprocessor/Filter", opts...)
    if err != nil {
        return nil, err
    }
    return &preprocessorFilterClient{stream}, nil
}

type preprocessorFilterClient struct {
    grpc.ClientStream
}

// Send sends a RawTick to the server.
func (x *preprocessorFilterClient) Send(m *RawTick) error {
    return x.ClientStream.SendMsg(m)
}

// Recv receives a SentimentTick from the server.
func (x *preprocessorFilterClient) Recv() (*SentimentTick, error) {
    m := new(SentimentTick)
    if err := x.ClientStream.RecvMsg(m); err != nil {
        return nil, err
    }
    return m, nil
}
