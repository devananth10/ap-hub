import calculusFigures from "../content/practice-figures/calculus-ab.json" with { type: "json" };
export type PracticeFigure = {
  xRange: number[]; yRange: number[]; description: string;
  title?:string; caption?:string;
  curves: { points: number[][]; start: "open" | "closed"; end: "open" | "closed" }[];
  dots: {x:number;y:number}[];
  slopeField?: {x:number;y:number;slope:number}[];
};
// Normalize in screen space, preserving dy/dx even when axis scales differ.
export function slopeSegment(figure:PracticeFigure,point:{x:number;y:number;slope:number}) {
  const sx=320/(figure.xRange[1]-figure.xRange[0]),sy=200/(figure.yRange[1]-figure.yRange[0]);
  const cx=40+(point.x-figure.xRange[0])*sx,cy=230-(point.y-figure.yRange[0])*sy;
  const length=Math.hypot(sx,point.slope*sy),dx=9*sx/length,dy=-9*point.slope*sy/length;
  return {x1:cx-dx,y1:cy-dy,x2:cx+dx,y2:cy+dy};
}
// Original local diagrams, keyed by stable question ID; no external image URLs.
export const practiceFigures = calculusFigures as Record<string,PracticeFigure>;
