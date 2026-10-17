import { Dashboard } from "@/components/dashboard";
import { getApprovedResources } from "@/lib/official-resources";
import { connection } from "next/server";
import { randomInt } from "node:crypto";
import { academicThemes, dashboardThemeAt } from "@/lib/artwork";

export default async function Home() {
  await connection();
  const illustration = dashboardThemeAt(randomInt(academicThemes.length));
  return <Dashboard approvedResources={getApprovedResources()} illustration={illustration} />;
}
