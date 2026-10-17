"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { courses } from "@/lib/courses";

const STORAGE_KEY = "ap-hub:v1";
type StudyData = { selected: string[]; notes: Record<string, string>; completed: string[]; saved: string[]; lastTopic: string | null };
const defaults: StudyData = { selected: ["chemistry", "biology", "calculus-ab"], notes: {}, completed: [], saved: [], lastTopic: null };
type StudyContext = StudyData & {
  ready: boolean; storageError: boolean; theme: "light" | "dark";
  toggleCourse: (id: string) => void; setNote: (id: string, text: string) => void;
  toggleCompleted: (id: string) => void; toggleSaved: (id: string) => void;
  visitTopic: (id: string) => void; toggleTheme: () => void;
};
const Context = createContext<StudyContext | null>(null);

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
export function StudyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyData>(defaults);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object") throw new Error("Invalid saved data");
        const value = parsed as Partial<StudyData>;
        if (!stringArray(value.selected) || !stringArray(value.completed) || !stringArray(value.saved) || !value.notes || typeof value.notes !== "object" || Array.isArray(value.notes) || !Object.values(value.notes).every((note) => typeof note === "string")) throw new Error("Invalid saved data");
        setData({ selected: value.selected.filter((id) => courses.some((course) => course.id === id)), completed: value.completed, saved: value.saved, notes: value.notes, lastTopic: typeof value.lastTopic === "string" ? value.lastTopic : null });
      }
    } catch { setStorageError(true); }
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [data, ready]);
  const toggleList = (key: "selected" | "completed" | "saved", id: string) => setData((current) => ({ ...current, [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id] }));
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ap-hub:theme", next); } catch { setStorageError(true); }
  };
  return <Context.Provider value={{ ...data, ready, storageError, theme, toggleTheme, toggleCourse: (id) => toggleList("selected", id), toggleCompleted: (id) => toggleList("completed", id), toggleSaved: (id) => toggleList("saved", id), setNote: (id, text) => setData((current) => ({ ...current, notes: { ...current.notes, [id]: text } })), visitTopic: (id) => setData((current) => current.lastTopic === id ? current : { ...current, lastTopic: id }) }}>{children}</Context.Provider>;
}
export function useStudy() {
  const value = useContext(Context);
  if (!value) throw new Error("useStudy must be used within StudyProvider");
  return value;
}
