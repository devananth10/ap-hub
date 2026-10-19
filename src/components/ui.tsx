"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Atom, BookOpen, FlaskConical, FunctionSquare, Globe2, Leaf, X } from "lucide-react";
import type { Course } from "@/lib/courses";
import { AcademicArt } from "./academic-art";

const icons = { flask: FlaskConical, leaf: Leaf, function: FunctionSquare, atom: Atom, book: BookOpen, globe: Globe2 };
export function CourseIcon({ course, size = 23 }: { course: Course; size?: number }) {
  const Icon = icons[course.icon];
  return <span className={`course-icon ${course.color}`}><Icon size={size} strokeWidth={1.6} /></span>;
}
export function Dialog({ title, children, onClose, className = "" }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog?.showModal();
    return () => { dialog?.close(); if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} aria-label={title} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="dialog-header"><h2>{title}</h2><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
export function OrbitArt({ compact = false }: { compact?: boolean }) {
  return <AcademicArt theme="chemistry" compact={compact} />;
}
