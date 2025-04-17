#include <stddef.h>
#include <stdint.h>

// FPGA-accelerated regex parser stub
typedef struct {
    const char* symbol;
    int64_t ts;
    float value;
} Tick;

Tick parse_frame(const uint8_t* data, size_t len) {
    // TODO: FPGA driver integration via /dev/fpga0
    Tick t = {"", 0, 0.0};
    return t;
}
