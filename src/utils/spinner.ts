import { spinner } from "@clack/prompts";
import type { Spinner } from "@clack/prompts";

let activeSpinner: Spinner | null = null;

export function startSpinner(msg: string): Spinner {
  activeSpinner = spinner();
  activeSpinner.start(msg);
  return activeSpinner;
}

export function stopSpinner(msg?: string, code = 0): void {
  if (!activeSpinner) return;
  if (code === 0) {
    activeSpinner.stop(msg);
  } else {
    activeSpinner.stop(msg || "Failed", code);
  }
  activeSpinner = null;
}

export function updateSpinner(msg: string): void {
  if (activeSpinner) {
    activeSpinner.message(msg);
  }
}