import { c } from "../utils/colors.ts";
import { getCommandList, getCommandDescription } from "./commands.ts";

export function generateHelp(): string {
  const commands = getCommandList();

  let output = "\n";
  output += c.bold("Bliss CLI v2.1\n");
  output += c.dim("The automated backend architect\n\n");

  output += c.info("Usage:\n");
  output += "  bliss <command> [options]\n\n";

  output += c.info("Commands:\n");
  for (const cmd of commands) {
    const desc = getCommandDescription(cmd);
    output += `  ${c.success(cmd.padEnd(12))} ${desc}\n`;
  }

  output += "\n";
  output += c.info("Examples:\n");
  output += "  bliss create my-api\n";
  output += "  bliss init\n";
  output += "  bliss add logger\n";
  output += "  bliss doctor\n";
  output += "  bliss git\n";
  output += "  bliss help create\n";

  output += "\n";
  output += c.dim("For more info: bliss help <command>\n");

  return output;
}
