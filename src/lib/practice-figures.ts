import calculusFigures from "../content/practice-figures/calculus-ab.json" with { type: "json" };
export type PracticeFigure = {
  xRange: number[]; yRange: number[]; description: string;
  curves: { points: number[][]; start: "open" | "closed"; end: "open" | "closed" }[];
  dots: {x:number;y:number}[];
};
// Original local diagrams, keyed by stable question ID; no external image URLs.
export const practiceFigures = calculusFigures as Record<string,PracticeFigure>;
