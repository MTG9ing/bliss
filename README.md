# Bliss CLI 🚀

**The automated backend architect for Node.js, Bun, and beyond.**

Bliss scaffolds production-ready backend projects with surgical precision. Choose your framework, pick your features, and deploy — all from one command.

## Features

- **🛠 Project Scaffolding** — `bliss create` generates complete Express, Fastify, or Vanilla projects
- **📦 Feature Modules** — `bliss add logger` injects features with auto-wiring
- **🔧 Smart Init** — `bliss init` configures existing projects or bootstraps empty folders
- **🏥 Health Checks** — `bliss doctor` diagnoses your project setup
- **🔀 Git & GitHub** — `bliss git` handles commits, PRs, releases, and auth
- **📋 Activity Logs** — `.bliss/logs/` tracks every command for transparency

## Installation

```bash
# Using npm
npm install -g @mtg9ing/bliss

# Using bun (recommended)
bun add -g @mtg9ing/bliss

# Using pnpm
pnpm add -g @mtg9ing/bliss
```

## Quick Start

### Create a new backend project
```bash
bliss create my-api
# Interactive prompts for framework, language, features
```

### Initialize current directory
```bash
cd my-project
bliss init
# Detects existing setup or offers full scaffold
```

### Add features to existing project
```bash
bliss add logger      # Structured logging with Pino
bliss add errors      # Centralized error handling
bliss add env         # Environment config with Zod
bliss add security    # Helmet, rate-limiting, sanitization
bliss add performance # Compression, caching
bliss add auth        # JWT authentication
bliss add cors        # CORS middleware
```

### Git & GitHub helpers
```bash
bliss git             # Interactive git menu
bliss git commit      # Conventional commits with prompts
bliss git pr          # Create GitHub pull request
bliss git whoami      # Check GitHub auth status
```

### Health check
```bash
bliss doctor          # Validate project setup
```

### View activity
```bash
bliss logs            # Show recent commands and results
```

## Commands

| Command | Description | Alias |
|---------|-------------|-------|
| `bliss create <name>` | Scaffold new project | `new`, `scaffold` |
| `bliss init` | Configure or bootstrap current directory | `setup` |
| `bliss add <feature>` | Add feature module | `install`, `boost` |
| `bliss remove <feature>` | Remove feature module | `uninstall` |
| `bliss doctor` | Run health checks | `check`, `diagnose` |
| `bliss git <action>` | Git & GitHub helpers | `gh` |
| `bliss logs` | View activity history | `activity`, `history` |
| `bliss help [cmd]` | Show help | `h` |

## Supported Frameworks

| Framework | Status | Features |
|-----------|--------|----------|
| Express.js | ✅ Stable | All features |
| Fastify | ✅ Stable | All features |
| Vanilla Node.js | ✅ Stable | All features |
| Hono | 🚧 Planned | — |
| Elysia | 🚧 Planned | — |

## Supported Package Managers

- ✅ **Bun** (recommended, auto-detected via `bun.lockb`)
- ✅ **npm** (auto-detected via `package-lock.json`)
- ✅ **pnpm** (auto-detected via `pnpm-lock.yaml`)

## Generated Project Structure

```
my-api/
├── src/
│   ├── index.ts          # Server bootstrap
│   ├── app.ts            # Framework setup
│   ├── routes/           # API routes
│   ├── lib/              # Utilities (auto-populated by features)
│   ├── middleware/       # Middleware (auto-populated by features)
│   └── config/           # Configuration (auto-populated by features)
├── tests/                # Vitest tests
├── .bliss/               # Bliss config & logs
│   ├── config.json
│   └── logs/
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md             # Auto-generated with feature list
```

## Feature Auto-Injection

Bliss doesn't just copy files — it **wires them into your app**:

```typescript
// Before: bliss add logger
import express from 'express';
const app = express();

// After: bliss add logger
import express from 'express';
import { requestLogger } from './middleware/request-logger.js';
const app = express();
app.use(requestLogger);  // ← Auto-injected
```

If auto-injection fails (complex file structure), Bliss provides manual instructions.

## Configuration

Bliss stores configuration in `.bliss/config.json`:

```json
{
  "version": "2.1.0",
  "project": {
    "name": "my-api",
    "type": "backend",
    "framework": "express",
    "language": "typescript",
    "entryFile": "src/app.ts"
  },
  "packageManager": "bun",
  "features": ["logger", "errors", "env"],
  "createdAt": "2026-05-25T19:40:00.000Z"
}
```

## Requirements

- [Bun](https://bun.sh/) >= 1.0.0 **or** [Node.js](https://nodejs.org/) >= 18
- Git (for `bliss git` commands)
- GitHub CLI or `GITHUB_TOKEN` (for GitHub API commands)

## Contributing

We love contributions!

- **Issues:** Bug reports and feature requests
- **PRs:** Follow existing code style, include tests, update README
- **Discussions:** Architecture decisions and roadmap

### Development

```bash
git clone https://github.com/MTG9ing/bliss.git
cd bliss
bun install
bun test
bun run build
```

## Roadmap

- [x] Express, Fastify, Vanilla support
- [x] Feature auto-injection
- [x] Git & GitHub integration
- [x] Activity logging
- [ ] Hono framework
- [ ] Elysia framework
- [ ] Frontend scaffolding (HTML/CSS/JS for GitHub Pages)
- [ ] Microservices architecture template
- [ ] MVC architecture template
- [ ] Docker deployment config
- [ ] CI/CD template generation

## License

MIT — see [LICENSE](./LICENSE)

---

Built with passion for the developer community. ❤️