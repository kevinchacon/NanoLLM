---
title: "1. What is a tensor?"
description: 'Multi-dimensional arrays as the foundation of every model computation — shapes, strides, and indexing.'
pubDate: 'Feb 18 2026'
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