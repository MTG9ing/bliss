export interface InjectionRule {
  targetFile: string;       // The file we need to modify (e.g., "src/index.ts" or "server.ts")
  anchor: string;           // The string we search for to know where to inject
  injectionType: "before" | "after";
}

export const expressRules: Record<string, InjectionRule> = {
  logger: {
    targetFile: "src/index.ts", 
    anchor: "const app = express()", // We look for where they instantiate Express
    injectionType: "after",          // We want to inject our middleware right after it
  },
};