import Link from "next/link";
export default function NotFound() { return <div className="page empty-state"><span className="eyebrow">404 · A SMALL DETOUR</span><h1>This page isn’t in the syllabus.</h1><p>Head back to your workspace and choose a course to keep learning.</p><Link href="/" className="button primary">Back to overview</Link></div>; }
