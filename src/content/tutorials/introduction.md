---
title: "0. Introduction: What We're Building"
description: 'A high-level overview of the NanoLLM project — building a transformer inference engine from scratch.'
pubDate: 'Feb 17 2026'
heroImage: '../../assets/0-introduction.png'
---

Large language models like GPT, LLaMA, and Mistral can feel like black boxes. NanoLLM is a project to **demystify them by building one piece at a time** — from raw tensor math all the way to a working inference engine that generates text.

## The Goal

By the end of this series, you'll have built a minimal but complete transformer inference engine. Given a set of pretrained weights and a text prompt, it will generate continuations token by token — the same core loop that powers every LLM you've used.

## What We'll Cover

The series is organized into phases, each building on the last:

**Tensors and linear algebra** — We start with the data structure at the heart of every model: the tensor. Then we implement matrix multiplication, the single operation that accounts for nearly all of a transformer's compute.

**Transformer components** — Linear layers, layer normalization, softmax, self-attention, multi-head attention, feed-forward networks, and residual connections. Each gets its own focused post.

**Tokenization** — How text becomes a sequence of integers the model can process, and how model output becomes text again.

**Model assembly** — Loading pretrained weights from disk, wiring up embeddings, and running a full forward pass through stacked transformer blocks.

**Inference** — Sampling strategies (temperature, top-k, nucleus) and the autoregressive generation loop.

**Optimization** — KV caching, profiling, and parallelism to make inference fast.

## What This Is Not

This is not a training tutorial. We won't implement backpropagation or write a training loop. The focus is entirely on **understanding the architecture and running inference** — the part that turns weights into words.

We also won't wrap things in abstractions until we understand what's underneath. Every operation is implemented explicitly before we move on.

## How to Follow Along

Each post is self-contained. Read them in order the first time through, but feel free to jump to any topic you're curious about — they're designed to be short and focused.

Let's start with the most fundamental piece: [what a tensor actually is](/tutorials).
