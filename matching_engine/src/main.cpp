#include <iostream>

extern "C" void run_auction();

int main() {
    std::cout << "Starting matching engine..." << std::endl;
    run_auction();
    std::cout << "Auction complete." << std::endl;
    return 0;
}
