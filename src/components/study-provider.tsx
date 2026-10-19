"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { courses } from "@/lib/courses";

import { STORAGE_KEY, THEME_KEY, defaultStudyData, parseStudyData, type StudyData } from "@/lib/study-storage";

type StudyContext = StudyData & {
  ready: boolean; storageError: boolean; theme: "light" | "dark";
  toggleCourse: (id: string) => void; setNote: (id: string, text: string) => void;
  toggleCompleted: (id: string) => void; toggleSaved: (id: string) => void;
  visitTopic: (id: string) => void; toggleTheme: () => void;
  toggleWatchedVideo: (id: string) => void;
};
const Context = createContext<StudyContext | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StudyData>(defaultStudyData);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(parseStudyData(JSON.parse(stored), courses));
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
  const toggleList = (key: "selected" | "completed" | "saved" | "watchedVideos", id: string) => setData((current) => ({ ...current, [key]: current[key].includes(id) ? current[key].filter((item) => item !== id) : [...current[key], id] }));
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { setStorageError(true); }
  };
  return <Context.Provider value={{ ...data, ready, storageError, theme, toggleTheme, toggleCourse: (id) => toggleList("selected", id), toggleCompleted: (id) => toggleList("completed", id), toggleSaved: (id) => toggleList("saved", id), toggleWatchedVideo: (id) => toggleList("watchedVideos", id), setNote: (id, text) => setData((current) => ({ ...current, notes: { ...current.notes, [id]: text } })), visitTopic: (id) => setData((current) => current.lastTopic === id ? current : { ...current, lastTopic: id }) }}>{children}</Context.Provider>;
}
export function useStudy() {
  const value = useContext(Context);
  if (!value) throw new Error("useStudy must be used within StudyProvider");
  return value;
}
