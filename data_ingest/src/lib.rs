use std::os::raw::c_char;
use std::ptr;

#[repr(C)]
#[derive(Debug)]
pub struct Tick {
    pub symbol: *const c_char,
    pub ts: i64,
    pub value: f32,
}

/// Stub parser: placeholder until FPGA integration
pub fn parse_frame(data: *const u8, len: usize) -> Tick {
    // TODO: integrate hardware parser via C
    Tick { symbol: ptr::null(), ts: 0, value: 0.0 }
}

pub mod feed_binance;
