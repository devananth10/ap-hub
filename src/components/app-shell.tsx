"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Bookmark, ChevronRight, Command, GraduationCap, LayoutGrid, Menu, Moon, Plus, Search, Sparkles, StickyNote, Sun, Target, X } from "lucide-react";
import { courses } from "@/lib/courses";
import { useStudy } from "./study-provider";
import { CourseIcon, Dialog } from "./ui";
import { CoursePicker } from "./course-picker";

const nav = [ { href: "/", label: "Overview", icon: LayoutGrid }, { href: "/courses", label: "My courses", icon: BookOpen }, { href: "/practice", label: "Practice", icon: Target }, { href: "/resources", label: "Saved resources", icon: Bookmark }, { href: "/notes", label: "My notes", icon: StickyNote } ];
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { selected, theme, toggleTheme, storageError } = useStudy();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => { setIsMobile(media.matches); if (!media.matches) setMobileOpen(false); };
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => { if (mobileOpen) sidebarRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(); }, [mobileOpen]);
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [path]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") { event.preventDefault(); setSearchOpen((value) => !value); }
      if (event.key === "Escape" && mobileOpen) { setMobileOpen(false); mobileTrigger.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside ref={sidebarRef} inert={isMobile && !mobileOpen} className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation" onKeyDown={(event) => {
      if (!isMobile || !mobileOpen || event.key !== "Tab") return;
      const controls = sidebarRef.current?.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a[href], button:not(:disabled)");
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <Link href="/" className="brand"><span className="brand-mark"><GraduationCap size={23} /></span><span>Prep<span className="brand-hub">Atlas</span><span className="brand-dot">.</span></span></Link>
      <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => { setMobileOpen(false); mobileTrigger.current?.focus(); }}><X size={19} /></button>
      <span className="workspace-label">YOUR STUDY SPACE</span>
      <nav className="main-nav">{nav.map(({ href, label, icon: Icon }) => <Link href={href} key={href} className={`nav-link ${href === "/practice" ? "nav-practice" : ""} ${path === href || href === "/courses" && path.startsWith("/courses/") ? "active" : ""}`} aria-current={path === href ? "page" : undefined}><Icon size={19} strokeWidth={1.7} /><span>{label}</span>{path === href && <span className="active-dot" />}</Link>)}</nav>
      <div className="sidebar-section-title"><span>MY COURSES</span><button className="icon-button small-icon" aria-label="Manage courses" onClick={() => setPickerOpen(true)}><Plus size={17} /></button></div>
      <nav className="course-nav">{courses.filter((course) => selected.includes(course.id)).map((course) => <Link href={`/courses/${course.id}`} key={course.id} className={path.includes(`/courses/${course.id}`) ? "current" : ""}><span className={`course-dot ${course.color}`} />{course.title}</Link>)}{selected.length === 0 && <p className="small muted">Your courses will appear here.</p>}</nav>
      <div className="sidebar-bottom"><div className="sidebar-note"><span className="tiny-label"><Sparkles size={14} /> A LITTLE, EVERY DAY</span><p>Big goals start with<br />small study sessions.</p><Link href="/courses">Find your next topic <ArrowRight size={14} /></Link></div>
      <div className="local-profile"><span className="avatar">Y</span><span><strong>Your workspace</strong><small>Saved on this device</small></span><span className="online-dot" /></div></div>
    </aside>
    <div className="app-body" inert={isMobile && mobileOpen}>
      <header className="topbar"><div className="header-left"><button ref={mobileTrigger} className="icon-button mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button><span className="breadcrumb-top">My workspace <ChevronRight size={14} /><strong>{path === "/" ? "Overview" : path.startsWith("/courses/") ? "Study space" : nav.find((item) => item.href === path)?.label || "PrepAtlas"}</strong></span></div>
        <div className="header-actions"><button className="search-trigger" aria-label="Search courses and topics" onClick={() => setSearchOpen(true)}><Search size={17} /><span>Find a course or topic</span><kbd><Command size={10} /> K</kbd></button><span className="header-divider" /><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} onClick={toggleTheme}>{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}</button><span className="avatar header-avatar">Y</span></div>
      </header>
      {storageError && <div className="storage-warning" role="alert">Local saving is unavailable. Keep this tab open and copy any important notes before leaving.</div>}
      <main id="main-content" className="main-content">{children}</main>
      <footer className="app-footer"><span>A little more understanding, every day.</span><span>PrepAtlas prototype <span>·</span> Independent of College Board</span></footer>
    </div>
    {pickerOpen && <CoursePicker onClose={() => setPickerOpen(false)} />}
    {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
  </>;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const matchedCourses = courses.filter((course) => course.title.toLowerCase().includes(normalized));
  const topics = normalized ? courses.flatMap((course) => course.units.flatMap((unit) => unit.topics.filter((topic) => `${topic.title} ${topic.number}`.toLowerCase().includes(normalized)).map((topic) => ({ ...topic, course })))).slice(0, 8) : [];
  return <Dialog title="Find your next topic" onClose={onClose} className="search-dialog"><label className="search-input"><Search size={20} /><input autoFocus placeholder="Try chemistry, orbitals, or 1.5…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search courses and topics" /></label><div className="search-results">{matchedCourses.map((course) => <Link onClick={onClose} key={course.id} href={`/courses/${course.id}`}><CourseIcon course={course} /><span><strong>{course.title}</strong><small>Course outline</small></span><ChevronRight size={17} /></Link>)}{topics.map((topic) => <Link onClick={onClose} key={`${topic.course.id}/${topic.id}`} href={`/courses/${topic.course.id}/${topic.id}`}><BookOpen size={20} /><span><strong>{topic.number} · {topic.title}</strong><small>{topic.course.title} · {topic.ready ? "Available now" : "Coming soon"}</small></span><ChevronRight size={17} /></Link>)}{matchedCourses.length === 0 && topics.length === 0 && <p className="empty-search">No matches yet. Try a course name or a different topic.</p>}</div></Dialog>;
}
