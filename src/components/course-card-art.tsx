import type { AcademicTheme } from "@/lib/artwork";

/** A few quiet strokes for small cards; full illustrations belong in the hero. */
export function CourseCardArt({ theme }: { theme: AcademicTheme }) {
  return (
    <svg className="course-card-line-art" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {theme === "chemistry" && <><ellipse cx="85" cy="52" rx="46" ry="17" transform="rotate(-30 85 52)" /><ellipse cx="85" cy="52" rx="46" ry="17" transform="rotate(30 85 52)" /><circle cx="85" cy="52" r="3" /></>}
      {theme === "biology" && <><path d="M65 15c60 22-20 48 40 70M105 15C45 37 125 63 65 85M71 25h28M73 50h24M71 75h28" /></>}
      {theme === "calculus" && <><path d="M40 17v65h88M45 70c32 0 29-42 48-42s16 32 34 10" /></>}
      {theme === "physics" && <><path d="M27 53c16-32 26-32 42 0s26 32 42 0 22-30 28-12" /><path d="M25 53h115" strokeDasharray="2 6" /></>}
      {theme === "history" && <><circle cx="85" cy="51" r="33" /><ellipse cx="85" cy="51" rx="14" ry="33" /><path d="M52 51h66" /></>}
      {theme === "literature" && <><path d="M85 30c-15-9-28-10-44-5v48c16-5 29-4 44 5 15-9 28-10 44-5V25c-16-5-29-4-44 5Zm0 0v48" /></>}
      {theme === "computer-science" && <><path d="M31 28h35v24h28v23h36M45 76V52h21m28 0V28h25" /><circle cx="31" cy="28" r="3" /><circle cx="130" cy="75" r="3" /><circle cx="119" cy="28" r="3" /></>}
      {theme === "geography" && <><path d="m39 29 29-9 32 10 29-10v54l-29 10-32-10-29 9Zm29-9v54m32-44v54" /></>}
    </svg>
  );
}
