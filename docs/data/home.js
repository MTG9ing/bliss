const HOME_DATA = {
  hero: {
    headline: "Backend Projects,",
    headlineAccent: "Instantly.",
    subheadline: "Scaffold complete backend projects with Bliss CLI. Express, Fastify, Hono, Elysia, Koa — TypeScript or JavaScript — in seconds.",
    cta: {
      primary: { label: "npm install -g @mtg9ing/bliss", action: "copy" },
      secondary: { label: "Read Documentation", url: "docs.html" }
    },
    stats: [
      { value: "6", label: "Frameworks" },
      { value: "<1s", label: "Scaffold time" },
      { value: "0", label: "Config needed" }
    ]
  },
  features: {
    title: "Everything you need,",
    titleAccent: "nothing you don't.",
    items: [
      {
        id: "scaffold",
        icon: "rocket",
        title: "Project Scaffolding",
        description: "Create complete projects with Express, Fastify, Hono, Elysia, Koa, or vanilla. TypeScript or JavaScript.",
        code: "bliss create my-api",
        color: "#00d4aa"
      },
      {
        id: "modules",
        icon: "box",
        title: "Module Injection",
        description: "Add logger, auth, env, error handling modules to existing projects. Surgical injection without breaking code.",
        code: "bliss add logger",
        color: "#ff6b6b"
      },
      {
        id: "health",
        icon: "shield",
        title: "Health Checks",
        description: "Run diagnostics on your project. Check dependencies, config, git, and more.",
        code: "bliss doctor",
        color: "#ffd93d"
      },
      {
        id: "deploy",
        icon: "cloud",
        title: "Deployment Ready",
        description: "Generate Docker, Fly.io, Render, or Vercel configs with one command.",
        code: "bliss deploy",
        color: "#6bcb77"
      },
      {
        id: "git",
        icon: "git-branch",
        title: "Git Helpers",
        description: "Shortcuts for common git operations. Init, commit, push, pull, log — all from Bliss.",
        code: "bliss git commit",
        color: "#4d96ff"
      },
      {
        id: "safety",
        icon: "checkSquare",
        title: "Safety First",
        description: "Smart detection prevents double-installation. Backups before changes. Restore anytime.",
        code: "bliss remove logger",
        color: "#c77dff"
      }
    ]
  },
  howItWorks: {
    title: "Three commands to production.",
    steps: [
      {
        num: "01",
        title: "Create",
        description: "Interactive wizard scaffolds your project with framework, language, and features of choice.",
        command: "bliss create my-api"
      },
      {
        num: "02",
        title: "Configure",
        description: "Initialize Bliss in existing projects. Detects framework, language, and package manager automatically.",
        command: "bliss init"
      },
      {
        num: "03",
        title: "Deploy",
        description: "Generate deployment configs for Docker, Fly.io, Render, or Vercel.",
        command: "bliss deploy"
      }
    ]
  },
  testimonials: {
    title: "Loved by developers.",
    items: [
      {
        name: "Sarah Chen",
        role: "CTO at FastTrack",
        avatar: "SC",
        text: "We cut our backend setup from 3 weeks to 2 minutes. Bliss just gets it.",
        rating: 5
      },
      {
        name: "Marcus Johnson",
        role: "Indie Hacker",
        avatar: "MJ",
        text: "Finally a scaffolding tool that doesn't fight me. It just works.",
        rating: 5
      },
      {
        name: "Elena Rodriguez",
        role: "Senior Engineer",
        avatar: "ER",
        text: "The module injection is genius. Added logging to our legacy app in seconds.",
        rating: 5
      }
    ]
  },
  terminal: {
    title: "See it in action.",
    lines: [
      { type: "input", content: "npm install -g @mtg9ing/bliss" },
      { type: "output", content: "added 1 package in 0.8s" },
      { type: "input", content: "bliss create my-api" },
      { type: "output", content: "✔ Framework: Express.js" },
      { type: "output", content: "✔ Language: TypeScript" },
      { type: "output", content: "✔ Features: ESLint, Prettier, Vitest" },
      { type: "output", content: "✔ Generated 8 files" },
      { type: "input", content: "cd my-api && bliss add logger" },
      { type: "output", content: "✔ Logger module installed" },
      { type: "output", content: "✔ Request logging middleware added" },
      { type: "input", content: "bliss deploy" },
      { type: "output", content: "✔ Dockerfile created" },
      { type: "output", content: "✔ docker-compose.yml created" },
      { type: "success", content: "🚀 Ready to deploy!" }
    ]
  }
};