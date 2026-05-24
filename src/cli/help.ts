import yocto from "yoctocolors";
import { getCommandList, getCommandDescription } from "./commands.ts";

export function generateHelp(): string {
  const commands = getCommandList();
  
  let output = "\n";
  output += yocto.bold("Bliss CLI v2.0\n");
  output += yocto.dim("The automated backend architect\n\n");
  
  output += yocto.cyan("Usage:\n");
  output += "  bliss <command> [options]\n\n";
  
  output += yocto.cyan("Commands:\n");
  for (const cmd of commands) {
    const desc = getCommandDescription(cmd);
    output += `  ${yocto.green(cmd.padEnd(12))} ${desc}\n`;
  }
  
  output += "\n";
  output += yocto.cyan("Examples:\n");
  output += "  bliss create my-api\n";
  output += "  bliss init\n";
  output += "  bliss add logger\n";
  output += "  bliss doctor\n";
  output += "  bliss help add\n";
  
  output += "\n";
  output += yocto.dim("For more info on a command: bliss help <command>\n");
  
  return output;
}