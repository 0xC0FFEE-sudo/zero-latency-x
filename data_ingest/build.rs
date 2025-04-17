fn main() {
    cc::Build::new()
        .file("src/parser_fpga.c")
        .compile("parser_fpga");
}
