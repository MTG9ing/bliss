# BLISS CLI v2.1 — PROJECT CONTEXT DOCUMENT
## For AI Assistants, Developers, and Business Stakeholders

---

## 1. PROJECT OVERVIEW

**Bliss CLI** is an automated backend scaffolding tool for Node.js/Bun ecosystems. 
It creates production-ready projects, injects features with auto-wiring, and provides 
Git/GitHub integration — all through interactive CLI prompts.

**Current Version:** 2.1 (complete rewrite from v2.0)
**Author:** Mohammed Ghazy <mtg9ing@gmail.com>
**Repository:** https://github.com/MTG9ing/bliss
**License:** MIT

---

## 2. CORE PHILOSOPHY

1. **User is Absolute Master** — Every decision is prompted, every default is overrideable
2. **Auto-Detect, Never Assume** — Check files, don't trust package.json alone
3. **Inject Smart, Fail Graceful** — Auto-inject when possible, manual instructions when complex
4. **Log Everything** — .bliss/logs/ for transparency and debugging
5. **Extensible by Design** — Add frameworks/features later without touching core logic
6. **Zero Duplication** — Single source of truth for all detection and metadata

---

## 3. SUPPORTED CONFIGURATIONS

### Frameworks (v2.1)
- ✅ Express.js
- ✅ Fastify
- ✅ Vanilla Node.js
- 🚧 Hono (planned)
- 🚧 Elysia (planned)

### Languages
- TypeScript (default)
- JavaScript

### Package Managers
- Bun (recommended, auto-detected via bun.lockb)
- npm (auto-detected via package-lock.json)
- pnpm (auto-detected via pnpm-lock.yaml)

### Project Types
- starter — Minimal files to get started
- backend — Full backend API project
- library — Package/library project
- frontend — HTML/CSS/JS (reserved for future)

---

## 4. COMMAND SET

| Command | Description | Aliases |
|---------|-------------|---------|
| bliss create <name> | Scaffold new project in new directory | new, scaffold |
| bliss init | Smart init: empty folder → scaffold; existing → configure | setup |
| bliss add <feature> | Add feature module + auto-inject into entry file | install, boost |
| bliss remove <feature> | Remove feature module + clean up entry file | uninstall |
| bliss doctor | Health checks + validation | check, diagnose |
| bliss git <action> | Interactive Git + GitHub menu | gh |
| bliss logs | View recent activity history | activity, history |
| bliss help [cmd] | Show help | h |

---

## 5. FEATURE MODULES (v2.1)

| Feature | Dependencies | Auto-Inject Target |
|---------|-------------|-------------------|
| logger | pino, pino-pretty | app.use(requestLogger) after app init |
| errors | none | app.use(errorHandler) before app.listen() |
| env | dotenv, zod | import { env } from './config/env.js' at top |
| cors | cors | app.use(cors()) after app init |
| security | helmet, express-rate-limit, express-mongo-sanitize, hpp | app.use(securityMiddleware) after app init |
| performance | compression | app.use(compression()) after app init |
| auth | jsonwebtoken, bcryptjs | app.use('/auth', authRoutes) after app init |

---

## 6. ARCHITECTURE

### Directory Structure
```
bliss/
├── src/
│   ├── cli/
│   │   ├── index.ts              # Entry point (citty runMain)
│   │   ├── commands.ts           # Command registry with lazy imports + aliases
│   │   └── help.ts               # Help text generator
│   ├── commands/
│   │   ├── create.ts             # Full project scaffold
│   │   ├── init.ts               # Smart init (empty vs existing detection)
│   │   ├── add.ts                # Add feature with auto-injection
│   │   ├── remove.ts             # Remove feature with cleanup
│   │   ├── doctor.ts             # Health checks
│   │   ├── git.ts                # Git + GitHub interactive commands
│   │   └── help.ts               # Per-command help
│   ├── core/
│   │   ├── config.ts             # .bliss/config.json CRUD
│   │   ├── detector.ts           # Single source: framework/lang/pm detection
│   │   ├── injector.ts           # Auto-injection engine (magic-string)
│   │   ├── installer.ts          # Package manager abstraction
│   │   └── logger.ts             # Internal CLI logger (NOT pino)
│   ├── templates/
│   │   ├── base/                 # Only .gitignore is static template
│   │   ├── express/              # Express scaffold files
│   │   ├── fastify/              # Fastify scaffold files
│   │   ├── vanilla/              # Vanilla scaffold files
│   │   └── features/             # Feature module templates
│   │       ├── logger/
│   │       ├── errors/
│   │       ├── env/
│   │       ├── cors/
│   │       ├── security/
│   │       ├── performance/
│   │       └── auth/
│   ├── types/
│   │   ├── config.ts             # Zod schemas + ProjectConfig type
│   │   └── framework.ts          # Framework enum + metadata
│   └── utils/
│       ├── fs.ts                 # Clean file ops (no console noise)
│       ├── colors.ts             # Terminal colors (yoctocolors)
│       ├── path.ts               # Path helpers
│       └── readme.ts             # README generator
├── tests/
│   ├── setup.ts                  # Test utilities + mock process.exit
│   ├── create.test.ts
│   ├── init.test.ts
│   ├── add.test.ts
│   ├── remove.test.ts
│   ├── doctor.test.ts
│   └── git.test.ts
├── README.md
├── package.json
├── tsconfig.json
└── biome.json
```

### Key Technical Decisions

1. **NO Handlebars** — package.json/tsconfig generated programmatically in code
2. **NO bundling scripts** — templates loaded from filesystem at runtime
3. **NO self-modifying source** — bundle.ts files removed
4. **NO global state** — spinner utility uses function-local state only
5. **NO console.error in utils** — fs.ts returns null on failure, caller decides logging
6. **Single detection source** — detector.ts only, rules/ directory removed
7. **Auto-injection with fallback** — magic-string for code injection, manual instructions if fails

---

## 7. AUTO-INJECTION ENGINE

### Entry File Detection (Multi-Strategy)
1. Read .bliss/config.json project.entryFile
2. Read package.json "main" field
3. Check framework convention files (src/index.ts, src/app.ts, src/server.ts)
4. Validate: does file contain framework initialization patterns?
5. If all fail → interactive prompt asking user for entry file

### Injection Points (Per Framework)
- **Import section**: After last import statement
- **Middleware section**: After app/framework initialization
- **Routes section**: Before app.listen() or server startup

### Injection Logic
- Use magic-string for non-destructive code modification
- Framework-specific regex patterns for reliable detection
- Fallback: print manual instructions if patterns not found

---

## 8. CONFIGURATION

### .bliss/config.json Schema
```json
{
  "version": "2.1.0",
  "project": {
    "name": "my-api",
    "type": "backend",
    "framework": "express",
    "language": "typescript",
    "structure": "standard",
    "entryFile": "src/app.ts"
  },
  "packageManager": "bun",
  "features": ["logger", "errors", "env"],
  "git": {
    "initialized": true,
    "remote": "origin",
    "url": "https://github.com/user/repo"
  },
  "github": {
    "username": "mtg9ing",
    "authenticated": true
  },
  "createdAt": "2026-05-25T19:40:00.000Z",
  "updatedAt": "2026-05-25T19:40:00.000Z"
}
```

---

## 9. GIT & GITHUB INTEGRATION

### Local Git Commands
- init, status, add, commit, push, pull, log, branch, undo, stash
- Interactive prompts with conventional commit helper (feat:, fix:, docs:)
- Pretty colored output

### GitHub API Commands (Phase 2)
- pr — Create pull request
- issue — Create/view issues
- release — Create release
- repo — Create repository

### Authentication
- bliss git whoami — Check auth status
- Supports GitHub CLI (gh) or GITHUB_TOKEN env var
- Guided setup if not authenticated

---

## 10. ACTIVITY LOGGING

### Log Location
.bbliss/logs/YYYY-MM-DD.log (daily rotation)

### Log Format
[ISO_TIMESTAMP] [LEVEL] bliss <command> [args]
[ISO_TIMESTAMP] [SUCCESS/FAILURE/ERROR] Result details

### Log Command
bliss logs — Interactive viewer with filtering by date, command, status

---

## 11. EXTENSIBILITY ROADMAP

### Adding New Framework (e.g., Hono)
1. Add "hono" to Framework union type in src/types/framework.ts
2. Create src/templates/hono/ directory with scaffold files
3. Add hono detection in src/core/detector.ts
4. Add hono metadata in src/types/framework.ts
5. Add hono injection points in src/core/injector.ts

### Adding New Feature (e.g., websockets)
1. Create src/templates/features/websockets/ with template files
2. Add websockets to FEATURE_MODULES registry
3. Define dependencies and injection points
4. Update README generator

### Adding New Structure (e.g., MVC)
1. Add "mvc" to ProjectStructure union type
2. Create src/templates/express/mvc/ with different file layout
3. Update create.ts to offer structure selection

### Adding New Package Manager (e.g., deno)
1. Add "deno" to PackageManager union type
2. Add deno detection in src/core/detector.ts
3. Add deno commands in src/core/installer.ts

---

## 12. IMPLEMENTATION ORDER

### Phase 1: Foundation
1. package.json — dependencies, scripts
2. tsconfig.json — compiler options
3. biome.json — linting/formatting rules
4. src/types/framework.ts — Framework enum + metadata
5. src/types/config.ts — Zod schemas
6. src/utils/colors.ts — Terminal colors
7. src/utils/fs.ts — Clean file operations
8. src/utils/path.ts — Path helpers
9. src/core/logger.ts — Internal CLI logger

### Phase 2: Core Engine
10. src/core/detector.ts — Detection engine
11. src/core/config.ts — Config CRUD
12. src/core/installer.ts — Package manager abstraction
13. src/core/injector.ts — Auto-injection engine
14. src/templates/engine.ts — Template rendering

### Phase 3: Templates
15. src/templates/base/.gitignore
16. src/templates/express/src/index.ts, app.ts, routes/index.ts
17. src/templates/fastify/src/index.ts, app.ts
18. src/templates/vanilla/src/index.ts
19. src/templates/features/logger/...
20. src/templates/features/errors/...
21. src/templates/features/env/...
22. src/templates/features/security/...
23. src/templates/features/performance/...
24. src/templates/features/auth/...
25. src/templates/features/cors/...

### Phase 4: Commands
26. src/cli/commands.ts — Registry
27. src/cli/help.ts — Help generator
28. src/commands/create.ts
29. src/commands/init.ts
30. src/commands/add.ts
31. src/commands/remove.ts
32. src/commands/doctor.ts
33. src/commands/git.ts
34. src/commands/help.ts
35. src/cli/index.ts — Entry point

### Phase 5: Tests & Polish
36. tests/setup.ts
37. tests/create.test.ts
38. tests/init.test.ts
39. tests/add.test.ts
40. tests/doctor.test.ts
41. tests/git.test.ts
42. README.md — Project README
43. .github/workflows/ci.yml

---

## 13. DEPENDENCIES

### Production
- citty ^0.2.2 — CLI framework
- @clack/prompts ^1.4.0 — Interactive prompts
- zod ^4.4.3 — Schema validation
- yoctocolors ^2.1.2 — Terminal colors
- magic-string ^0.30.21 — Code injection

### Development
- @biomejs/biome ^2.4.15 — Linter/formatter
- @types/bun latest — Bun types
- vitest latest — Test runner

### Removed from v2.0
- handlebars — No longer needed (programmatic generation)
- bundle scripts — No longer needed (filesystem templates)

---

## 14. TESTING STRATEGY

- Vitest for all tests (consistent across package managers)
- tests/setup.ts — Mock process.exit, temp directory utilities
- Integration tests for create/init/add commands using temp dirs
- Unit tests for detector, injector, config utilities
- CI: lint → test → build (GitHub Actions)

---

## 15. NOTES FOR AI ASSISTANTS

When working on this codebase:
1. Always check .bliss/config.json for project state before modifying files
2. Use detector.ts for all framework/language/pm detection — never duplicate logic
3. Auto-inject features using injector.ts — fallback to manual instructions if patterns fail
4. Log all commands to .bliss/logs/ using core/logger.ts
5. Use clack prompts for all user interaction — never use raw readline
6. Generate package.json/tsconfig in code — no template files for JSON
7. Keep templates in src/templates/ as static files (only .ts, .js, .gitignore)
8. Add new frameworks by creating directory in src/templates/ + updating types
9. Add new features by creating directory in src/templates/features/ + updating registry
10. User is always prompted — never make destructive changes without confirmation

---

## 16. CONTACT & CONTRIBUTING

- Issues: https://github.com/MTG9ing/bliss/issues
- Discussions: Architecture and roadmap
- PRs: Follow biome linting, include tests, update this doc if architecture changes
- Author: Mohammed Ghazy <mtg9ing@gmail.com>

---

Document Version: 2.1.0
Last Updated: 2026-05-25