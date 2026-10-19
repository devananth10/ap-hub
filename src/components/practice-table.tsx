import {practiceTables} from "@/lib/practice-tables";
export function PracticeTable({questionId}:{questionId:string}) {
  const table=practiceTables[questionId];if(!table) return null;
  return <div className="practice-table-wrap" data-question-table={questionId}><table className="practice-table"><caption>{table.caption}</caption><thead><tr>{table.headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{table.rows.map((row,i)=><tr key={i}>{row.map((value,j)=>j===0?<th key={j} scope="row">{value}</th>:<td key={j}>{value}</td>)}</tr>)}</tbody></table></div>;
}
