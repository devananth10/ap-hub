import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata={title:"Password recovery"};
export default function Page(){return <Suspense fallback={<p>Loading recovery…</p>}><AuthForm mode="forgot"/></Suspense>;}
