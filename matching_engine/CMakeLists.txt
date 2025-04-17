cmake_minimum_required(VERSION 3.15)
project(matching_engine)

set(CMAKE_CXX_STANDARD 17)
file(GLOB SOURCES "src/*.cpp")
add_library(matcher STATIC ${SOURCES})

# Link SUAVE library for MEV-free auctions
find_library(SUAVE_LIB suave HINTS /usr/local/lib)
if(SUAVE_LIB)
    message(STATUS "Found SUAVE library: ${SUAVE_LIB}")
    target_link_libraries(matcher PRIVATE ${SUAVE_LIB})
else()
    message(STATUS "SUAVE library not found, building without SUAVE")
endif()
target_compile_definitions(matcher PRIVATE FPGA_ACCELERATED)

# Build main executable
add_executable(matching_engine_exe src/main.cpp)
target_link_libraries(matching_engine_exe PRIVATE matcher)
