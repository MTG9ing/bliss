import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import MagicString from "magic-string";

interface MutateOptions {
  filePath: string;
  anchor: string;
  toInject: string;
  position?: "before" | "after"; // Add optional position argument (defaults to after)
}

export async function createFileFromTemplate(targetPath: string, templateContent: string): Promise<void> {
  const targetDir = dirname(targetPath);
  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, templateContent, "utf-8");
}

export async function injectMiddlewareIntoFile({ 
  filePath, 
  anchor, 
  toInject, 
  position = "after" 
}: MutateOptions): Promise<boolean> {
  try {
    const sourceCode = await readFile(filePath, "utf-8");
    const anchorIndex = sourceCode.indexOf(anchor);
    
    if (anchorIndex === -1) {
      return false;
    }

    const s = new MagicString(sourceCode);
    
    // Calculate index dynamically based on our positioning strategy
    if (position === "before") {
      // Insert directly ahead of the first character of our anchor string
      s.appendLeft(anchorIndex, `${toInject}\n`);
    } else {
      // Insert immediately following the final character of our anchor string
      const insertionPoint = anchorIndex + anchor.length;
      s.appendRight(insertionPoint, `\n${toInject}`);
    }

    await writeFile(filePath, s.toString(), "utf-8");
    return true;
  } catch {
    return false;
  }
}