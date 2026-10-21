"use client";
import {useState} from 'react';
import type {PracticeFigure as Figure} from '@/lib/practice-figures';
import {PracticeFigure} from './practice-figure';
import {Dialog} from './ui';

export function SummaryMathFigure({figure,id}:{figure:Figure;id:string}) {
  const [open,setOpen]=useState(false),[zoom,setZoom]=useState(100);
  return <div className="summary-math-figure">
    <div className="stimulus-heading"><strong>{figure.title}</strong><button className="text-button" aria-label={`Enlarge ${figure.title}`} onClick={()=>{setZoom(100);setOpen(true);}}>Enlarge</button></div>
    <PracticeFigure questionId={id} figure={figure}/>
    {open&&<Dialog title={figure.title!} onClose={()=>setOpen(false)} className="stimulus-dialog summary-math-dialog"><div className="stimulus-zoom-controls"><label>Zoom <input type="range" min="100" max="200" step="25" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><output>{zoom}%</output></div><div className="stimulus-zoom-scroll"><div style={{width:`${zoom}%`}}><PracticeFigure questionId={id+'-expanded'} figure={figure}/></div></div><p>{figure.description}</p></Dialog>}
  </div>;
}
