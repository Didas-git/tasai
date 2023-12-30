import { parseUsing24BitColors } from "./macros/24bit.macro.js" with { type: "macro" };

console.log(parseUsing24BitColors("<bg_black>hello <bright_red>world<r> or <cyan>Dave<r> and <87>8bits<r> and ofc <#ff00ef>hex<r> and <hsl,0.1,1,0.5>24bits<r><r>"));
