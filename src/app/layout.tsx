import type { Metadata } from "next";
import { StudyProvider } from "@/components/study-provider";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = { title: { default: "PrepAtlas — Your space to understand", template: "%s | PrepAtlas" }, description: "A calmer way to study for AP courses. Your lessons, resources, and optional notes, together in one place." };
const themeScript = `(function(){try{var t=localStorage.getItem('ap-hub:theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body><AuthProvider><StudyProvider><AppShell>{children}</AppShell></StudyProvider></AuthProvider></body></html>;
}
