"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Atom, BookOpen, FlaskConical, FunctionSquare, Globe2, Leaf, X } from "lucide-react";
import type { Course } from "@/lib/courses";

const icons = { flask: FlaskConical, leaf: Leaf, function: FunctionSquare, atom: Atom, book: BookOpen, globe: Globe2 };
export function CourseIcon({ course, size = 23 }: { course: Course; size?: number }) {
  const Icon = icons[course.icon];
  return <span className={`course-icon ${course.color}`}><Icon size={size} strokeWidth={1.6} /></span>;
}
export function Dialog({ title, children, onClose, className = "" }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-header"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
export function OrbitArt({ compact = false }: { compact?: boolean }) {
  return <svg className={compact ? "orbit-art compact" : "orbit-art"} viewBox="0 0 380 280" fill="none" aria-hidden="true">
    <defs><radialGradient id={compact ? "core-small" : "core"}><stop stopColor="#D9F4C8" /><stop offset="1" stopColor="#74BBA2" /></radialGradient></defs>
    <circle cx="195" cy="140" r="115" stroke="currentColor" strokeOpacity=".09" />
    <circle cx="195" cy="140" r="83" stroke="currentColor" strokeOpacity=".09" />
    <path d="M45 140H345M195 12V268" stroke="currentColor" strokeOpacity=".09" strokeDasharray="3 6" />
    <ellipse cx="195" cy="140" rx="126" ry="46" transform="rotate(-30 195 140)" stroke="currentColor" strokeOpacity=".6" />
    <ellipse cx="195" cy="140" rx="126" ry="46" transform="rotate(30 195 140)" stroke="currentColor" strokeOpacity=".6" />
    <ellipse cx="195" cy="140" rx="126" ry="46" transform="rotate(90 195 140)" stroke="currentColor" strokeOpacity=".6" />
    <circle cx="195" cy="140" r="27" fill={`url(#${compact ? "core-small" : "core"})`} />
    <circle cx="91" cy="190" r="9" fill="#DBEBC4" /><circle cx="291" cy="195" r="7" fill="#81BEB0" /><circle cx="195" cy="32" r="7" fill="#D9B99B" />
    <path d="M58 53v12m-6-6h12M325 97v10m-5-5h10M310 238v12m-6-6h12" stroke="currentColor" strokeOpacity=".65" />
    <text x="50" y="235" fill="currentColor" opacity=".5" fontSize="11" fontFamily="monospace">1s² 2s² 2p⁶</text>
    <text x="283" y="45" fill="currentColor" opacity=".5" fontSize="10" fontFamily="monospace">e⁻</text>
  </svg>;
}
