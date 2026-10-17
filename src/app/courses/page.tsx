import { Dashboard } from "@/components/dashboard";
import { getApprovedResources } from "@/lib/official-resources";
export const metadata = { title: "My courses" };
export default function Courses() { return <Dashboard library approvedResources={getApprovedResources()} />; }
