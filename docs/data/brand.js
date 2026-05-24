const BRAND_DATA = {
  hero: {
    title: "Bliss",
    titleAccent: "Brand Assets",
    description: "Official logos, colors, and usage guidelines for the Bliss brand."
  },
  logos: {
    title: "Logo",
    description: "The Bliss logo combines a hexagon (structure) with a lightning bolt (speed).",
    variants: [
      { name: "Primary", bg: "dark", color: "#ffffff" },
      { name: "Light", bg: "light", color: "#0a0a0a" },
      { name: "Icon Only", bg: "dark", color: "#00d4aa" }
    ]
  },
  colors: {
    title: "Colors",
    palette: [
      { name: "Primary", hex: "#00d4aa", usage: "CTAs, links, accents" },
      { name: "Dark", hex: "#0a0a0a", usage: "Backgrounds, text" },
      { name: "Light", hex: "#f5f5f5", usage: "Light backgrounds" },
      { name: "Accent Red", hex: "#ff6b6b", usage: "Errors, warnings" },
      { name: "Accent Yellow", hex: "#ffd93d", usage: "Highlights, stars" },
      { name: "Accent Blue", hex: "#4d96ff", usage: "Info, code" }
    ]
  },
  typography: {
    title: "Typography",
    fonts: [
      { name: "Inter", role: "Primary", weights: "400, 500, 600, 700" },
      { name: "JetBrains Mono", role: "Code", weights: "400, 500" }
    ]
  },
  usage: {
    title: "Usage Rules",
    rules: [
      "Maintain clear space around the logo equal to the height of the lightning bolt.",
      "Do not stretch, rotate, or alter the logo proportions.",
      "Use the primary logo on dark backgrounds and the light variant on light backgrounds.",
      "The icon-only variant works for favicons, app icons, and small spaces.",
      "Always use the official colors. Do not create custom color variants."
    ]
  }
};
