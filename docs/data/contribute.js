const CONTRIBUTE_DATA = {
  hero: {
    title: "Help us build",
    titleAccent: "the future of backend scaffolding.",
    description: "Bliss is open source and community-driven. Every contribution matters, from code to documentation."
  },
  ways: {
    title: "How to contribute",
    items: [
      {
        icon: "code",
        title: "Code",
        description: "Fix bugs, add features, or improve performance. Check our good first issues.",
        link: "https://github.com/mtg9ing/bliss/issues?q=label%3A%22good+first+issue%22"
      },
      {
        icon: "book-open",
        title: "Documentation",
        description: "Help us write clearer docs, tutorials, and examples.",
        link: "https://github.com/mtg9ing/bliss/tree/main/docs"
      },
      {
        icon: "message-circle",
        title: "Community",
        description: "Answer questions, share your setup, or write blog posts.",
        link: "https://github.com/mtg9ing/bliss/discussions"
      },
      {
        icon: "dollar-sign",
        title: "Sponsor",
        description: "Fund development and get priority support.",
        link: "https://github.com/sponsors/mtg9ing"
      }
    ]
  },
  stats: {
    title: "Community by numbers",
    items: [
      { value: "2.0", label: "Latest Version", icon: "star" },
      { value: "6", label: "Frameworks", icon: "box" },
      { value: "4", label: "Built-in Modules", icon: "layers" },
      { value: "10+", label: "Commands", icon: "terminal" }
    ]
  },
  guidelines: {
    title: "Contribution Guidelines",
    steps: [
      {
        num: "1",
        title: "Fork & Clone",
        code: "git clone https://github.com/your-username/bliss.git"
      },
      {
        num: "2",
        title: "Install Dependencies",
        code: "cd bliss && bun install"
      },
      {
        num: "3",
        title: "Create Branch",
        code: "git checkout -b feature/your-feature"
      },
      {
        num: "4",
        title: "Make Changes",
        code: "# Edit code, add tests, update docs"
      },
      {
        num: "5",
        title: "Submit PR",
        code: "git push origin feature/your-feature"
      }
    ]
  }
};