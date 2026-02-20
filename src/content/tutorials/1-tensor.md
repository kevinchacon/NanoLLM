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