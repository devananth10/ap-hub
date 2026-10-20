import data from "../content/practice-stimuli/human-geography.json" with { type: "json" };

type Point = { x: number; y: number; label: string; value?: number; labelAlign?: "start" | "middle" | "end" };
type Base = { title: string; description: string; caption: string; hypothetical: true; attribution: "Original PrepAtlas schematic and synthetic data" };
export type MapStimulus = Base & {
  kind: "map"; mapType: "choropleth" | "dot" | "reference" | "flow" | "isoline" | "proportional";
  unitLabel: string;
  regions: { label: string; polygon: number[][]; value?: number }[];
  bins?: { min: number; max: number; label: string }[];
  points?: Point[]; dots?: {x:number;y:number}[];
  paths?: { label: string; points: number[][]; arrow?: boolean; value?: number }[];
  kmPerUnit?: number;
};
export type ChartStimulus = Base & { kind: "chart"; display?: "bar" | "line"; unitLabel: string; categories: string[]; series: {label:string;values:number[]}[]; max: number };
export type PyramidStimulus = Base & { kind: "pyramid"; unitLabel: string; cohorts: {label:string;ageStart:number;ageEnd:number|null;male:number;female:number}[]; max: number };
export type ModelStimulus = Base & { kind: "model"; assumptions: string; nodes: Point[]; edges: {from:string;to:string;label:string}[]; rings?: {radius:number;label:string}[] };
export type TableStimulus = Base & { kind: "table"; headers: string[]; rows: string[][] };
export type GeographyStimulus = MapStimulus | ChartStimulus | PyramidStimulus | ModelStimulus | TableStimulus;

export function mapBin(value: number, bins: NonNullable<MapStimulus["bins"]>) {
  return bins.findIndex(bin => value >= bin.min && value < bin.max);
}
/** Geometry helpers shared by the renderer and numeric rendering assertions. */
export const mapX = (value: number) => 40 + value * 3.8;
export const mapY = (value: number) => 35 + value * 3.3;
export const chartHeight = (value: number, max: number) => value / max * 170;
export const lineX = (index: number, count: number) => 80 + index * 360 / (count - 1);
export const pyramidWidth = (value: number, max: number) => value / max * 140;
export const symbolRadius = (value: number, max: number) => 20 * Math.sqrt(value / max);
export function validateGeographyStimulus(stimulus: GeographyStimulus) {
  const fail = (reason: string): never => { throw new Error("Geography stimulus: " + reason); };
  const finite = (n: number) => typeof n === "number" && Number.isFinite(n);
  const coords = (points: number[][]) => points.length >= 2 && points.every(p => p.length === 2 && p.every(finite) && p[0] >= 0 && p[0] <= 100 && p[1] >= 0 && p[1] <= 60);
  if (!stimulus || !stimulus.title || !stimulus.caption || !stimulus.description || !stimulus.hypothetical || stimulus.attribution !== "Original PrepAtlas schematic and synthetic data") fail("original hypothetical provenance and accessible description required");
  if (stimulus.kind === "map") {
    if (!["choropleth","dot","reference","flow","isoline","proportional"].includes(stimulus.mapType) || !stimulus.unitLabel || !stimulus.regions.length) fail("map type, legend and regions required");
    for (const region of stimulus.regions) if (!region.label || region.polygon.length < 3 || !coords(region.polygon)) fail("invalid region geometry");
    if (new Set(stimulus.regions.map(r => r.label)).size !== stimulus.regions.length) fail("duplicate regions");
    if (stimulus.bins) {
      if (!stimulus.bins.length || stimulus.bins.length > 5) fail("one to five map bins required");
      stimulus.bins.forEach((bin,i) => { if (!finite(bin.min) || !finite(bin.max) || bin.min >= bin.max || !bin.label || i && stimulus.bins![i-1].max !== bin.min) fail("legend bins must be ordered, contiguous and nonoverlapping"); });
      for (const region of stimulus.regions) if (!finite(region.value!) || mapBin(region.value!,stimulus.bins) < 0) fail("region outside legend");
    }
    if (stimulus.mapType === "choropleth" && !stimulus.bins) fail("choropleth needs explicit bins");
    if (stimulus.mapType === "dot" && !stimulus.dots?.length) fail("dot map needs dots");
    for (const point of [...(stimulus.points || []), ...(stimulus.dots || [])]) if (!coords([[point.x,point.y],[point.x,point.y]])) fail("point outside map");
    for (const point of stimulus.points || []) if (point.labelAlign !== undefined && !["start","middle","end"].includes(point.labelAlign)) fail("invalid point label alignment");
    for (const path of stimulus.paths || []) if (!path.label || !coords(path.points) || path.value !== undefined && !finite(path.value)) fail("invalid path");
    if (stimulus.mapType === "flow" && (!stimulus.paths?.length || !stimulus.paths.every(path => path.arrow))) fail("flow direction must be explicit");
    if (stimulus.kmPerUnit !== undefined && (!finite(stimulus.kmPerUnit) || stimulus.kmPerUnit <= 0)) fail("invalid map scale");
    if (stimulus.mapType === "proportional" && (!stimulus.points?.length || !stimulus.points.every(p => finite(p.value!) && p.value! > 0))) fail("positive symbol values required");
  } else if (stimulus.kind === "chart") {
    if (!finite(stimulus.max) || stimulus.max <= 0 || !stimulus.unitLabel || !stimulus.categories.length || !stimulus.series.length || stimulus.series.length > 3) fail("invalid chart axes");
    if (stimulus.display !== undefined && !["bar","line"].includes(stimulus.display) || stimulus.display === "line" && stimulus.categories.length < 2) fail("invalid chart display or line categories");
    for (const series of stimulus.series) if (!series.label || series.values.length !== stimulus.categories.length || !series.values.every(n => finite(n) && n >= 0 && n <= stimulus.max)) fail("chart data outside axis");
  } else if (stimulus.kind === "pyramid") {
    if (!finite(stimulus.max) || stimulus.max <= 0 || !stimulus.unitLabel || stimulus.cohorts.length < 3) fail("invalid pyramid axis/cohorts");
    stimulus.cohorts.forEach((row,i) => {
      if (!row.label || ![row.male,row.female].every(n => finite(n) && n >= 0 && n <= stimulus.max)) fail("invalid pyramid values");
      if (!Number.isInteger(row.ageStart) || row.ageStart < 0 || (row.ageEnd === null ? i !== stimulus.cohorts.length-1 : !Number.isInteger(row.ageEnd) || row.ageEnd < row.ageStart)) fail("invalid age cohort bounds");
      if (i === 0 ? row.ageStart !== 0 : stimulus.cohorts[i-1].ageEnd === null || row.ageStart !== stimulus.cohorts[i-1].ageEnd!+1) fail("age cohorts must be contiguous, youngest first");
    });
  } else if (stimulus.kind === "model") {
    if (!stimulus.assumptions || !stimulus.nodes.length) fail("model assumptions and nodes required");
    const labels = new Set(stimulus.nodes.map(n => n.label));
    if (labels.size !== stimulus.nodes.length) fail("unique node labels required");
    for (const n of stimulus.nodes) if (!coords([[n.x,n.y],[n.x,n.y]])) fail("invalid node");
    for (const edge of stimulus.edges) if (!labels.has(edge.from) || !labels.has(edge.to) || !edge.label) fail("unknown model node");
    for (const ring of stimulus.rings || []) if (!finite(ring.radius) || ring.radius <= 0 || ring.radius > 28 || !ring.label) fail("invalid model ring");
  } else if (stimulus.kind === "table") {
    if (stimulus.headers.length < 2 || !stimulus.rows.length || !stimulus.headers.every(Boolean) || !stimulus.rows.every(row => row.length === stimulus.headers.length && row.every(cell => typeof cell === "string" && !!cell))) fail("invalid accessible table");
  } else fail("unknown stimulus type");
  return stimulus;
}

export const geographyStimuli = data as Record<string, GeographyStimulus>;
for (const stimulus of Object.values(geographyStimuli)) validateGeographyStimulus(stimulus);
