"use client";
import {useId,useState} from "react";
import {Dialog} from "./ui";
import {geographyStimuli,mapBin,mapX,mapY,chartHeight,lineX,pyramidWidth,symbolRadius,type GeographyStimulus} from "@/lib/geography-stimuli";

export function GeographyStimulus({questionId}:{questionId:string}) {
  const stimulus=geographyStimuli[questionId];
  const [expanded,setExpanded]=useState(false);
  const [zoom,setZoom]=useState(100);
  if(!stimulus)return null;
  return <figure className="geography-stimulus" data-geography-stimulus={questionId}>
    <div className="stimulus-heading"><strong>{stimulus.title}</strong><button type="button" className="text-button" onClick={()=>{setZoom(100);setExpanded(true);}} aria-label={"Enlarge "+stimulus.title}>Enlarge</button></div>
    <StimulusContent stimulus={stimulus}/><figcaption>{stimulus.caption}<span>{stimulus.attribution} · Hypothetical; not real-world statistics.</span></figcaption>
    {expanded&&<Dialog title={stimulus.title} onClose={()=>setExpanded(false)} className="stimulus-dialog"><div className="stimulus-zoom-controls"><label>Zoom <input type="range" min="100" max="200" step="25" value={zoom} onChange={event=>setZoom(Number(event.target.value))}/></label><output>{zoom}%</output></div><div className="stimulus-zoom-scroll"><div style={{width:`${zoom}%`}}><StimulusContent stimulus={stimulus}/></div></div><p className="small muted">{stimulus.caption}</p></Dialog>}
  </figure>;
}

export function StimulusContent({stimulus:s}:{stimulus:GeographyStimulus}) {
  const id=useId();
  if(s.kind==='table')return <><p className="stimulus-description">{s.description}</p><DataTable headers={s.headers} rows={s.rows}/></>;
  const pairs=s.kind==='pyramid'?[...s.cohorts].reverse():[];
  return <>
    <svg className="geography-graphic" viewBox={s.kind==='pyramid'?`0 0 480 ${100+s.cohorts.length*30}`:'0 0 480 280'} role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{s.title}</title><desc id={`${id}-description`}>{s.description}</desc>
      <defs><marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={s.kind==='map'&&s.bins?'#152c27':'currentColor'} stroke={s.kind==='map'&&s.bins?'#f3f9f6':undefined} strokeWidth=".6"/></marker></defs>
      {s.kind==='map'&&<>
        <g className="geo-regions">{s.regions.map(region=><polygon key={region.label} data-region={region.label} data-value={region.value} data-bin={region.value!==undefined&&s.bins?mapBin(region.value,s.bins):undefined} className={s.bins?`geo-shade-${mapBin(region.value!,s.bins)}`:''} points={region.polygon.map(([x,y])=>`${mapX(x)},${mapY(y)}`).join(' ')}/>)}</g>
        {s.paths?.map((path,i)=><g key={i} className={s.bins?"geo-path geo-path-on-fill":"geo-path"}>{s.bins&&<polyline className="geo-path-halo" points={path.points.map(([x,y])=>`${mapX(x)},${mapY(y)}`).join(' ')} aria-hidden="true"/>}<polyline data-path={path.label} data-arrow-end={!!path.arrow} points={path.points.map(([x,y])=>`${mapX(x)},${mapY(y)}`).join(' ')} markerEnd={path.arrow?`url(#${id}-arrow)`:undefined}/><text x={mapX(path.points[Math.floor((path.points.length-1)/2)][0])+4} y={mapY(path.points[Math.floor((path.points.length-1)/2)][1])-8}>{path.label}</text></g>)}
        {s.regions.map(region=>{const [x,y]=region.labelPoint||[region.polygon.reduce((a,p)=>a+p[0],0)/region.polygon.length,region.polygon.reduce((a,p)=>a+p[1],0)/region.polygon.length];return <text className={s.bins?"geo-region-label":"geo-region-label geo-region-label-unshaded"} key={region.label} x={mapX(x)} y={mapY(y)} textAnchor="middle">{region.label}{region.value!==undefined?`: ${region.value}`:''}</text>;})}
        {s.dots?.map((point,i)=><circle key={i} className="geo-dot" cx={mapX(point.x)} cy={mapY(point.y)} r={3.5}/>)}
        {s.points?.map(point=>{const radius=s.mapType==='proportional'?symbolRadius(point.value!,Math.max(...s.points!.map(p=>p.value!))):5;return <g key={point.label}><circle className="geo-point" data-point={point.label} data-value={point.value} cx={mapX(point.x)} cy={mapY(point.y)} r={radius}/><text data-point-label={point.label} textAnchor={point.labelAlign||"start"} x={mapX(point.x)+(point.labelAlign==='middle'?0:point.labelAlign==='end'?-8:8)} y={mapY(point.y)-(s.mapType==='proportional'?radius+8:8)}>{point.label}{point.value!==undefined?` (${point.value})`:''}</text></g>;})}
        <g className="geo-north"><path d="M446 65 L446 40 M441 48 L446 40 L451 48"/><text x="446" y="31" textAnchor="middle">N</text></g>
        {s.kmPerUnit?<g className="geo-scale"><path d="M40 250 L116 250 M40 245 L40 255 M116 245 L116 255"/><text x="40" y="273">0</text><text x="116" y="273" textAnchor="middle">{20*s.kmPerUnit} km</text></g>:<text x="40" y="267">Schematic · not to scale</text>}
      </>}
      {s.kind==='chart'&&<>
        <g className="geo-axis"><path d="M62 35 L62 220 L452 220"/>{[0,.25,.5,.75,1].map(f=><g key={f}><line x1="58" x2="452" y1={220-f*170} y2={220-f*170}/><text x="52" y={224-f*170} textAnchor="end">{s.max*f}</text></g>)}</g>
        <text x="62" y="23">{s.unitLabel}</text>
        {s.display==='line'?s.series.map((series,j)=>{
          const color=['#438b78','#b58a56','#648ca3'][j],points=series.values.map((value,i)=>[lineX(i,s.categories.length),220-chartHeight(value,s.max)]);
          return <g key={series.label}><polyline className="geo-line" data-series={series.label} points={points.map(p=>p.join(',')).join(' ')} stroke={color} strokeDasharray={j===1?'7 4':undefined}/>{points.map(([x,y],i)=>{const highest=Math.max(...s.series.map(row=>row.values[i])),above=series.values[i]===highest&&!s.series.slice(0,j).some(row=>row.values[i]===highest);return <g key={i} data-series={series.label} data-category={s.categories[i]} data-value={series.values[i]}>{j===0?<circle className="geo-line-circle" cx={x} cy={y} r="5" stroke={color}/>:<rect x={x-3} y={y-3} width="6" height="6" fill={color}/>}<text x={x} y={y+(above?-11:19)} textAnchor="middle">{series.values[i]}</text></g>;})}</g>;
        }):s.series.flatMap((series,j)=>series.values.map((value,i)=>{const group=370/s.categories.length,width=group/(s.series.length+1),x=70+i*group+j*width;return <g key={`${j}-${i}`}><rect className={`geo-bar geo-series-${j}`} data-series={series.label} data-category={s.categories[i]} data-value={value} x={x} y={220-chartHeight(value,s.max)} width={width-3} height={chartHeight(value,s.max)}/><text x={x+width/2} y={213-chartHeight(value,s.max)} textAnchor="middle">{value}</text><text x={x+width/2} y="238" textAnchor="middle">{String.fromCharCode(65+j)}</text></g>;}))}
        {s.categories.map((label,i)=><text key={label} x={s.display==='line'?lineX(i,s.categories.length):70+(i+.35)*370/s.categories.length} y="262" textAnchor="middle">{label}</text>)}
      </>}
      {s.kind==='pyramid'&&<>
        <text x="146" y="24" textAnchor="middle">Male</text><text x="334" y="24" textAnchor="middle">Female</text>
        {pairs.map((row,i)=>{const y=45+i*30;return <g key={row.label}><rect className="geo-bar geo-series-0" data-cohort={row.label} data-side="male" data-value={row.male} x={220-pyramidWidth(row.male,s.max)} y={y} width={pyramidWidth(row.male,s.max)} height="23"/><rect className="geo-bar geo-series-1" data-cohort={row.label} data-side="female" data-value={row.female} x="260" y={y} width={pyramidWidth(row.female,s.max)} height="23"/><text x="240" y={y+17} textAnchor="middle">{row.label}</text></g>;})}
        {[0,.5,1].map(f=><g key={f}><text x={220-f*140} y={65+pairs.length*30} textAnchor="middle">{s.max*f}</text><text x={260+f*140} y={65+pairs.length*30} textAnchor="middle">{s.max*f}</text></g>)}<text x="240" y={92+pairs.length*30} textAnchor="middle">{s.unitLabel} · each side uses the same scale</text>
      </>}
      {s.kind==='model'&&<>
        {s.rings&&[...s.rings].sort((a,b)=>b.radius-a.radius).map((ring,i)=><g key={ring.label}><circle className={`geo-ring geo-shade-${i}`} cx={mapX(50)} cy={mapY(30)} r={ring.radius*3.3}/><text x={mapX(50)} y={mapY(30)-ring.radius*3.3+14} textAnchor="middle">{ring.label}</text></g>)}
        {s.edges.map((edge,i)=>{const from=s.nodes.find(n=>n.label===edge.from)!,to=s.nodes.find(n=>n.label===edge.to)!;return <g key={i} className="geo-path"><line x1={mapX(from.x)} y1={mapY(from.y)} x2={mapX(to.x)} y2={mapY(to.y)} markerEnd={`url(#${id}-arrow)`}/><text x={mapX((from.x+to.x)/2)} y={mapY((from.y+to.y)/2)-8} textAnchor="middle">{edge.label}</text></g>;})}
        {s.nodes.map(n=><g key={n.label}><circle className="geo-point" cx={mapX(n.x)} cy={mapY(n.y)} r="5"/><text data-node-label={n.label} x={mapX(n.x)+(n.labelPosition==='left'?-12:n.labelPosition==='right'?12:0)} y={mapY(n.y)+(n.labelPosition==='above'?-12:n.labelPosition==='left'||n.labelPosition==='right'?4:21)} textAnchor={n.labelPosition==='left'?'end':n.labelPosition==='right'?'start':'middle'}>{n.label}</text></g>)}
      </>}
    </svg>
    <p className="stimulus-description">{s.description}</p>
    {s.kind==='map'&&<><p className="stimulus-legend">{s.unitLabel}</p>{s.bins&&<ul className="geo-legend">{s.bins.map((bin,i)=><li key={bin.label}><span className={`geo-shade-${i}`} aria-hidden="true"/>{bin.label}</li>)}</ul>}</>}
    {s.kind==='chart'&&<><ul className="geo-legend">{s.series.map((series,i)=><li key={series.label}>{String.fromCharCode(65+i)}: {series.label}{s.display==='line'?[' · solid / circles',' · dashed / squares'][i]:''}</li>)}</ul><DataTable headers={['Category',...s.series.map(row=>row.label)]} rows={s.categories.map((category,i)=>[category,...s.series.map(row=>String(row.values[i]))])}/></>}
    {s.kind==='pyramid'&&<DataTable headers={['Age cohort','Male','Female']} rows={s.cohorts.map(row=>[row.label,String(row.male),String(row.female)])}/>}
    {s.kind==='model'&&<p className="stimulus-legend">Assumptions: {s.assumptions}</p>}
  </>;
}
function DataTable({headers,rows}:{headers:string[];rows:string[][]}) {
  return <div className="geo-table-wrap"><table><thead><tr>{headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th key={j} scope="row">{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}
