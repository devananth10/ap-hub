import { Dashboard } from "@/components/dashboard";
import { getApprovedResources } from "@/lib/official-resources";
export default function Home() { return <Dashboard approvedResources={getApprovedResources()} />; }
