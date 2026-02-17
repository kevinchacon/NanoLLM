# NanoLLM

**Building a transformer inference engine from scratch**

Large language models like GPT, LLaMA, and Mistral can feel like black boxes. NanoLLM is a project to demystify them by building one piece at a time — from raw tensor math all the way to a working inference engine that generates text.

## What You'll Learn

This tutorial series walks through building a minimal but complete transformer inference engine. By the end, you'll have code that can load pretrained weights and generate text token by token — the same core loop that powers every LLM you've used.

The series covers:

- **Tensors and linear algebra** — The data structures and operations at the heart of every model
- **Transformer components** — Attention mechanisms, layer normalization, feed-forward networks, and residual connections
- **Tokenization** — How text becomes numbers the model can process
- **Model assembly** — Loading pretrained weights and wiring up a complete transformer
- **Inference** — Sampling strategies and the autoregressive generation loop
- **Optimization** — KV caching, profiling, and parallelism to make inference fast

We won't implement training or backpropagation. The focus is entirely on understanding the architecture and running inference — the part that turns weights into words.

## About This Repository

This repo hosts the blog and tutorials at [nanollm.com](https://nanollm.com). The site is built with Astro and automatically deployed to GitHub Pages on every push.

### Local Development

```sh
npm install
npm run dev
```

Open `http://localhost:4321` to view the site locally.

### Content Structure

Tutorials are stored as Markdown files in `src/content/tutorials/`. Each tutorial has frontmatter with title, description, publication date, and hero image.

The site rebuilds and deploys automatically via GitHub Actions whenever changes are pushed to `main`.
