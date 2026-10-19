import tables from "../content/practice-tables/calculus-ab.json" with {type:"json"};
export type PracticeTableData={caption:string;headers:string[];rows:string[][]};
export const practiceTables=tables as Record<string,PracticeTableData>;
