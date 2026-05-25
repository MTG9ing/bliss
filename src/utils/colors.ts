import yocto from "yoctocolors";

/**
 * Terminal color utilities
 * Centralized so we can swap yoctocolors for another library later
 */
export const c = {
  info: yocto.cyan,
  success: yocto.green,
  warning: yocto.yellow,
  error: yocto.red,
  dim: yocto.dim,
  bold: yocto.bold,
  magenta: yocto.magenta,
  blue: yocto.blue,
  white: yocto.white,
};
