export const UNITS = [
  "cup",
  "tbsp",
  "tsp",
  "fl oz",
  "oz",
  "lb",
  "g",
  "kg",
  "ml",
  "l",
  "pinch",
  "clove",
  "piece",
  "slice",
  "sprig",
  "strip"
] as const;

export type Unit = (typeof UNITS)[number];
