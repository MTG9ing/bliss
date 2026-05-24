const DOCS_DATA = {
  sections: [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "rocket",
      content: [
        {
          type: "heading",
          level: 2,
          text: "Installation"
        },
        {
          type: "paragraph",
          text: "Bliss requires Bun >= 1.0.0. Install globally to use the CLI anywhere."
        },
        {
          type: "code",
          language: "bash",
          code: "npm install -g @mtg9ing/bliss\n# or\nbun add -g @mtg9ing/bliss"
        },
        {
          type: "heading",
          level: 2,
          text: "Quick Start"
        },
        {
          type: "paragraph",
          text: "Create a new project with an interactive wizard."
        },
        {
          type: "code",
          language: "bash",
          code: "bliss create my-api\n# Follow the prompts for framework, language, and features"
        }
      ]
    },
    {
      id: "commands",
      title: "CLI Commands",
      icon: "terminal",
      content: [
        {
          type: "heading",
          level: 2,
          text: "Core Commands"
        },
        {
          type: "table",
          headers: ["Command", "Description", "Example"],
          rows: [
            ["bliss create <name>", "Scaffold a new project", "bliss create my-api"],
            ["bliss init", "Configure existing project", "bliss init"],
            ["bliss add <module>", "Add a module (logger, auth, etc.)", "bliss add logger"],
            ["bliss remove <module>", "Remove a module", "bliss remove logger"],
            ["bliss list", "List installed modules", "bliss list"],
            ["bliss update <module>", "Update a module", "bliss update logger"],
            ["bliss doctor", "Run health checks", "bliss doctor"],
            ["bliss deploy", "Generate deployment config", "bliss deploy"],
            ["bliss git <action>", "Git helpers", "bliss git commit -m \"fix\""]
          ]
        },
        {
          type: "heading",
          level: 2,
          text: "Aliases"
        },
        {
          type: "paragraph",
          text: "Shorthand commands for common operations."
        },
        {
          type: "code",
          language: "bash",
          code: "bliss boost <module>    # alias for 'add'\nbliss install <module>    # alias for 'add'\nbliss uninstall <module>  # alias for 'remove'\nbliss ls                  # alias for 'list'\nbliss check               # alias for 'doctor'\nbliss h                   # alias for 'help'"
        }
      ]
    },
    {
      id: "modules",
      title: "Modules",
      icon: "box",
      content: [
        {
          type: "heading",
          level: 2,
          text: "Built-in Modules"
        },
        {
          type: "paragraph",
          text: "Modules are injected into your project with surgical precision. Each module includes dependencies, files, and configuration."
        },
        {
          type: "code",
          language: "bash",
          code: "bliss add logger    # Pino-based structured logging\nbliss add auth      # Authentication middleware\nbliss add env       # Environment variable loader\nbliss add errors    # Error handling middleware"
        }
      ]
    },
    {
      id: "create",
      title: "Project Creation",
      icon: "settings",
      content: [
        {
          type: "heading",
          level: 2,
          text: "bliss create"
        },
        {
          type: "paragraph",
          text: "Creates a complete backend project with your chosen framework and features."
        },
        {
          type: "code",
          language: "bash",
          code: `bliss create my-api\n# Interactive prompts:\n# - Framework: Express.js | Fastify | Hono | Elysia | Koa | Vanilla\n# - Language: TypeScript | JavaScript\n# - ESLint: Yes | No\n# - Prettier: Yes | No\n# - Dockerfile: Yes | No\n# - Tests (Vitest): Yes | No`
        },
        {
          type: "heading",
          level: 2,
          text: "Flags"
        },
        {
          type: "table",
          headers: ["Flag", "Description", "Example"],
          rows: [
            ["--framework, -f", "Specify framework", "-f express"],
            ["--language, -l", "Specify language", "-l typescript"],
            ["--skip-install", "Skip dependency installation", "--skip-install"]
          ]
        }
      ]
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: "cloud",
      content: [
        {
          type: "heading",
          level: 2,
          text: "Deploy Anywhere"
        },
        {
          type: "paragraph",
          text: "Bliss generates deployment configs for multiple platforms."
        },
        {
          type: "code",
          language: "bash",
          code: "bliss deploy        # Interactive prompt\n# Choose: docker | fly | render | vercel"
        },
        {
          type: "heading",
          level: 2,
          text: "Docker"
        },
        {
          type: "paragraph",
          text: "Generates Dockerfile and docker-compose.yml with multi-stage build."
        },
        {
          type: "heading",
          level: 2,
          text: "Fly.io"
        },
        {
          type: "paragraph",
          text: "Generates fly.toml with auto-scaling configuration."
        }
      ]
    }
  ]
};