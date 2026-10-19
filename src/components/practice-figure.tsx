"use client";
import {useId} from "react";
import {practiceFigures,slopeSegment} from "@/lib/practice-figures";

export function PracticeFigure({questionId}:{questionId:string}) {
  const id=useId(), figure=practiceFigures[questionId];
  if(!figure) return null;
  const [xmin,xmax]=figure.xRange,[ymin,ymax]=figure.yRange;
  const x=(value:number)=>40+(value-xmin)/(xmax-xmin)*320;
  const y=(value:number)=>230-(value-ymin)/(ymax-ymin)*200;
  const xticks=Array.from({length:Math.floor(xmax)-Math.ceil(xmin)+1},(_,i)=>Math.ceil(xmin)+i);
  const yticks=Array.from({length:Math.floor(ymax)-Math.ceil(ymin)+1},(_,i)=>Math.ceil(ymin)+i);
  const axisX=x(Math.max(xmin,Math.min(xmax,0))),axisY=y(Math.max(ymin,Math.min(ymax,0)));
  return <figure className="practice-figure" data-question-figure={questionId}>
    <svg viewBox="0 0 400 270" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{figure.slopeField?'Slope field':'Graph of f'}</title><desc id={`${id}-description`}>{figure.description}</desc>
      <g className="plot-grid">{xticks.map(tick=><line key={'x'+tick} x1={x(tick)} y1={30} x2={x(tick)} y2={230}/>)}{yticks.map(tick=><line key={'y'+tick} x1={40} y1={y(tick)} x2={360} y2={y(tick)}/>)}</g>
      <g className="plot-axes"><line x1={40} y1={axisY} x2={370} y2={axisY}/><line x1={axisX} y1={240} x2={axisX} y2={20}/></g>
      <g className="plot-labels">{xticks.filter(tick=>tick!==0).map(tick=><text key={'x'+tick} x={x(tick)} y={axisY+15} textAnchor="middle">{tick}</text>)}{yticks.filter(tick=>tick!==0).map(tick=><text key={'y'+tick} x={axisX-8} y={y(tick)+3} textAnchor="end">{tick}</text>)}<text x={375} y={axisY+4}>x</text><text x={axisX+7} y={18}>y</text><text x={axisX-9} y={axisY+14}>0</text></g>
      <g className="plot-curves">{figure.curves.map((curve,i)=><polyline key={i} points={curve.points.map(([px,py])=>`${x(px)},${y(py)}`).join(' ')}/>)}</g>
      <g className="plot-curves">{figure.slopeField?.map((point,i)=><line key={i} {...slopeSegment(figure,point)}/>)}</g>
      {figure.curves.flatMap((curve,i)=>[curve.points[0],curve.points.at(-1)!].map(([px,py],j)=><circle key={`${i}-${j}`} className={j===0?curve.start:curve.end} cx={x(px)} cy={y(py)} r={4}/>))}
      {figure.dots.map((dot,i)=><circle key={'dot'+i} className="closed" cx={x(dot.x)} cy={y(dot.y)} r={4}/>)}
    </svg>
    <figcaption>{figure.slopeField?figure.description:'Hollow dots exclude a point; filled dots show its assigned value.'}</figcaption>
  </figure>;
}
