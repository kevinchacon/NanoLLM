---
title: "1. What is a tensor?"
description: 'Multi-dimensional arrays as the foundation of every model computation — shapes, strides, and indexing.'
pubDate: 'Feb 19 2026'
heroImage: '../../assets/1-what-is-a-tensor.png'
---

Before jumping into what a tensor is, we need to set the scene: what is a machine learning model actually doing when it runs?

## The Life of a Model

A machine learning model goes through two major phases:

1. **Training** — The model learns. It is fed massive amounts of data and, through an iterative process of forward passes, loss calculation, backpropagation, and weight updates (which we won't cover in this guide), its internal parameters are adjusted until it can perform the task well.

2. **Inference** — Once trained, the model takes some input and produces an output: a prediction, a generated token, a classification, and so on. This is what happens every time you send a message to an LLM like ChatGPT or Claude.

The key takeaway: training produces a set of **weights** — billions of numbers that encode everything the model has learned. Inference takes those weights and uses them to process new inputs.

An **inference engine** (what we are building in this guide) is the software responsible for doing this as efficiently as possible: loading the weights, accepting input, running the computation, and returning the output.

To run inference, we rely on what is called the *computational graph*.

## The Computational Graph

Under the hood, a neural network is a directed acyclic graph (DAG) where:

- Each **node** is an operation:
  - Matrix multiplication
  - Addition
  - Softmax
  - Layer normalisation
  - And others
- Each **edge** is data flowing from one operation to the next.

For a transformer like GPT, this graph encodes the full architecture (don't worry about each term — we'll cover them in the corresponding chapters):

- Token embedding lookup
- Multi-head self-attention
- Feed-forward layers
- Residual connections
- Final output projection

The inference engine walks through this graph node by node — or in optimised parallel chunks — executing each operation in sequence.

With that context established, we can now get into what tensors are and why they are the fundamental data structure behind every one of these operations.

## Tensors

A tensor is a multi-dimensional array of numbers. It is the fundamental data structure that flows along the edges of the computational graph — every input, output, and intermediate value in a neural network is expressed as a tensor.

In practice, the word "tensor" is just a generalisation of things you already know:

| Dimensions | Name   | Example                              |
|-----------|--------|--------------------------------------|
| 0         | Scalar | A single number: `1.0`               |
| 1         | Vector | A list of numbers: `[1.0, 2.0, 3.0]` |
| 2         | Matrix | A grid of numbers: `[[1, 2], [3, 4]]` |
| 3+        | Tensor | Higher-dimensional arrays: a batch of matrices |

During inference, almost everything is a tensor. To make this concrete (although do not worry about it for now):

- **Input data** — A batch of tokenised text, shaped `[batch_size, sequence_length]`
- **Model weights** — A linear layer's weight matrix, shaped `[in_features, out_features]`. These are loaded from the trained model file and remain fixed during inference.
- **Intermediate activations** — The outputs of each layer as data flows through the graph. After the attention mechanism, for example, you might have a tensor of shape `[batch_size, sequence_length, hidden_dim]`.
- **Key–value cache** — In autoregressive generation, past key and value tensors are cached to avoid redundant computation. These are typically shaped `[batch_size, num_heads, cached_length, head_dim]`.

The inference engine's core job is to efficiently schedule a graph of tensor operations: taking input tensors, applying the operations defined by the graph using weight tensors, and producing output tensors.

At the implementation level, a tensor is a contiguous block of memory plus some metadata. In C++, the data might be a `float*` or a quantised equivalent. The metadata describes:

- **Shape** — the size of each dimension, e.g. `[4, 512, 768]`
- **Strides** — how to navigate the memory layout (more on this in a later chapter)
- **Data type** — `float32`, `float16`, `int8`, and so on 

## Onto the Implementation

Now that we have covered the concepts, we can move on to building. The first step is setting up the project environment.

I'll be writing this in C++. If you'd prefer a different language, feel free to follow along in whatever you're comfortable with — the concepts are the same everywhere.

### Project Structure

Create the following structure inside your `nanollm` directory:

```
nanollm/
├── CMakeLists.txt
├── include/
│   └── nanollm/
├── src/
├── tests/
└── main.cpp
```

### CMakeLists.txt

For those new to C++, `CMakeLists.txt` is the configuration file for CMake — a cross-platform build system. It tells the build system how to configure, compile, and link the project.

The process happens in three stages:

**1. Configuration** — CMake figures out:
- Which compiler to use (e.g. `g++`, `clang++`)
- Which language standard to enforce (e.g. C++17)
- Where the source files are (e.g. `main.cpp`, `src/`)
- Where the header files are (e.g. `include/`) — in C++, headers and implementations live in separate files
- Which compiler flags to apply (e.g. `-Wall -O2`)

**2. Compilation** — The build system translates each `.cpp` source file into an object file (`.o` or `.obj`), applying all configured flags and resolving `#include` directives.

**3. Linking** — All object files are combined into a single executable. Function calls, variables, and library dependencies are resolved, producing a runnable binary.

This is different from other languages:
- **Python** — no compilation or linking needed; the interpreter handles everything at runtime.
- **C# / Java** — compilation exists, but linking is handled by the runtime or the JVM.

Add the following to your `CMakeLists.txt`:

```cmake
# Minimum CMake version required to build this project
cmake_minimum_required(VERSION 3.16)

# Project name and language
# LANGUAGES CXX sets up the C++ compiler environment
# and creates variables like NanoLLM_VERSION
project(NanoLLM LANGUAGES CXX)

# Use C++17
set(CMAKE_CXX_STANDARD 17)

# Require C++17 strictly — don't silently fall back to an older standard
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compiler flags:
# -Wall    enables most compiler warnings
# -Wextra   enables additional warnings
# -Wpedantic enforces strict ISO C++ compliance
# -O2     optimization level 2 (good balance of performance and compile time)
add_compile_options(-Wall -Wextra -Wpedantic -O2)

# Collect all .cpp files under src/ recursively into SOURCES
file(GLOB_RECURSE SOURCES src/*.cpp)

# Create the main executable from main.cpp and all collected sources
add_executable(nanollm main.cpp ${SOURCES})

# Add the include/ directory to the header search path
# PRIVATE means only this target uses it
target_include_directories(nanollm PRIVATE include)

# A second executable for tests — commented out for now, we'll add it later
# add_executable(test_tensor tests/test_tensor.cpp ${SOURCES})
# target_include_directories(test_tensor PRIVATE include)
```

Now we need to add some code to main.cpp so that it actually compiles and runs.
```cpp
// main.cpp

int main() {
    return 0;
}
```

Once that's in place, build and run the project:

```bash
mkdir build && cd build
cmake ..
make -j$(nproc)
./nanollm
```

