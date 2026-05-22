# Bliss

**The automated backend architect for your Node.js/Bun projects.**

Bliss is a CLI tool designed to take the friction out of setting up professional-grade backend infrastructure. Instead of manually installing and configuring loggers, environment loaders, or error handlers, Bliss surgically injects them into your project in seconds.

## Why Bliss?

Setting up a new project is repetitive. Bliss does the "boring" work for you:

- **Surgical Injection**: Modifies your `index.ts` without breaking your existing code.
- **Platform Agnostic**: Works seamlessly across Windows, macOS, and Linux.
- **Safety First**: Smart detection prevents double-installation and warns you before making changes.

## Quick Start

### 1. Installation

Install Bliss globally via npm or bun:

```bash
# Using npm
npm install -g @mtg9ing/bliss

# Using bun
bun add -g @mtg9ing/bliss
```

### 2. Usage

Navigate to your project folder and run:

```bash
bliss init
```

Once initialized, you can add powerful architectural layers to your app:

```bash
bliss boost
```

## How It Works

Bliss works by analyzing your project structure and performing "surgical injections":

1. **Detection**: Scans for your framework (Express, Fastify, etc.).
2. **Injection**: Safely appends necessary imports and middleware to your entry point.
3. **Verification**: Verifies package installation to ensure your project remains stable and dependency-compliant.

## Contribution

Bliss is open to contributions! Whether you want to add a new template, suggest a feature, or improve the documentation, we welcome your help.

- **Submit an Issue**: Found a bug or have a feature idea? Open an issue.
- **Pull Requests**: We welcome PRs. Please ensure your code follows the existing style and includes tests.
- **Community**: Join the discussion and help us make backend setup obsolete!

---

Built with passion for the developer community. ❤️