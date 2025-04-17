#include <cstdint>
#include <cstring>

// Order struct for matching engine
typedef struct {
    uint64_t id;
    char symbol[8];
    double qty;
    char side; // 'B' or 'S'
} Order;

extern "C" Order book_match(const Order& o) {
    // TODO: FPGA-based matching engine logic
    return o;
}
