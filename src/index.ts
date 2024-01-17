import { Colorizer } from "./structures/colorizer.js";
import { Tasai } from "./structures/tasai.js";

export * from "./structures/gradients.js";
export * from "./structures/colorizer.js";
export * from "./structures/color.js";
export * from "./structures/tasai.js";

export * from "./colors/4bit.js";
export * from "./colors/8bit.js";
export * from "./colors/24bit.js";
export * from "./colors/shared.js";

export const c = new Colorizer();
export const t = new Tasai();
