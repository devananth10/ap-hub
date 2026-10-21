import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata={title:"Create account"};
export default function Page(){return <Suspense fallback={<p>Loading account form…</p>}><AuthForm mode="signup"/></Suspense>;}
