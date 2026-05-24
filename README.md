# Bliss CLI

**The automated backend architect for your Node.js/Bun projects.**

Bliss is a CLI tool that scaffolds and enhances backend projects with surgical precision. Create new projects, inject modules, and deploy — all from one command.

## Features

- **Project Scaffolding** — `bliss create` generates complete Express/Fastify/Hono/etc. projects with TypeScript or JavaScript
- **Module Injection** — `bliss add` surgically injects features (logger, auth, error handling) without breaking existing code
- **Health Checks** — `bliss doctor` diagnoses your project setup
- **Deployment Config** — `bliss deploy` generates Docker, Fly.io, Render, or Vercel configs
- **Git Helpers** — `bliss git` shortcuts for common git operations

## Installation

```bash
# Using npm
npm install -g @mtg9ing/bliss

# Using bun
bun add -g @mtg9ing/bliss
```

## Quick Start

### Create a new project
```bash
bliss create my-api
# Interactive prompts for framework, language, features
```

### Configure an existing project
```bash
cd my-existing-project
bliss init
```

### Add a module
```bash
bliss add logger    # Structured logging
bliss add auth      # Authentication
bliss add errors    # Error handling
```

### Check project health
```bash
bliss doctor
```

### Generate deployment config
```bash
bliss deploy        # Choose: docker, fly, render, vercel
```

## Commands

| Command | Description | Alias |
|---------|-------------|-------|
| `bliss create <name>` | Scaffold a new project | — |
| `bliss init` | Configure existing project | — |
| `bliss add <module>` | Install a module | `boost`, `install` |
| `bliss remove <module>` | Remove a module | `uninstall` |
| `bliss list` | List modules | `ls` |
| `bliss update <module>` | Update a module | — |
| `bliss doctor` | Health checks | `check` |
| `bliss deploy` | Generate deployment config | — |
| `bliss git <action>` | Git helpers | — |
| `bliss help` | Show help | `h` |

## Requirements

- [Bun](https://bun.sh/) >= 1.0.0
- Node.js >= 18 (for running generated projects)

## Contributing

Contributions welcome!

- **Issues**: Bug reports and feature requests
- **PRs**: Follow existing code style, include tests
- **Community**: Help make backend setup obsolete

## License

MIT — see [LICENSE](./LICENSE)

---

Built with passion for the developer community. ❤️