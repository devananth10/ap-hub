import type { Metadata } from "next";
import { StudyProvider } from "@/components/study-provider";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = { title: { default: "AP Hub — Your space to understand", template: "%s | AP Hub" }, description: "A calmer way to study for AP courses. Your lessons, resources, and optional notes, together in one workspace." };
const themeScript = `(function(){try{var t=localStorage.getItem('ap-hub:theme');document.documentElement.dataset.theme=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><StudyProvider><AppShell>{children}</AppShell></StudyProvider></body></html>;
}
