import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata={title:"Reset password"};
export default function Page(){return <Suspense fallback={<p>Loading reset form…</p>}><AuthForm mode="password"/></Suspense>;}
