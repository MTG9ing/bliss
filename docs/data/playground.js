const PLAYGROUND_DATA = {
  hero: {
    title: "Try Bliss",
    titleAccent: "in your browser.",
    description: "No installation required. See how Bliss scaffolds projects and adds modules."
  },
  demo: {
    title: "Interactive Terminal",
    commands: [
      {
        cmd: "bliss create my-api",
        description: "Create a new project",
        output: [
          "✔ Project name: my-api",
          "✔ Framework: Express.js",
          "✔ Language: TypeScript",
          "✔ ESLint: Yes",
          "✔ Prettier: Yes",
          "✔ Tests: Yes",
          "✔ Generated project files"
        ]
      },
      {
        cmd: "bliss init",
        description: "Configure existing project",
        output: [
          "✔ Detected Express.js project",
          "✔ Language: TypeScript",
          "✔ Package Manager: npm",
          "✔ Created bliss.config.json"
        ]
      },
      {
        cmd: "bliss add logger",
        description: "Add logger module",
        output: [
          "✔ Installing pino, pino-pretty...",
          "✔ Generated src/lib/logger.ts",
          "✔ Added request logging middleware",
          "✔ Module logger installed"
        ]
      },
      {
        cmd: "bliss doctor",
        description: "Run health checks",
        output: [
          "✔ package.json: found",
          "✔ Start script: found",
          "✔ Bliss config: found",
          "✔ Dependencies: installed",
          "⚠ Git: not a git repository"
        ]
      },
      {
        cmd: "bliss deploy",
        description: "Generate deployment config",
        output: [
          "✔ Target: Docker",
          "✔ Dockerfile created",
          "✔ docker-compose.yml created",
          "✔ Ready to deploy"
        ]
      }
    ]
  },
  configurator: {
    title: "Project Configurator",
    description: "Select options to see your project setup preview.",
    modules: [
      { id: "express", name: "Express.js", icon: "zap", color: "#00d4aa" },
      { id: "fastify", name: "Fastify", icon: "zap", color: "#ff6b6b" },
      { id: "hono", name: "Hono", icon: "zap", color: "#6bcb77" },
      { id: "elysia", name: "Elysia", icon: "zap", color: "#ffd93d" },
      { id: "koa", name: "Koa", icon: "zap", color: "#c77dff" },
      { id: "vanilla", name: "Vanilla", icon: "zap", color: "#4d96ff" }
    ]
  }
};