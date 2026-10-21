import { ProgressDashboard } from "@/components/progress-dashboard";
import { getApprovedResources } from "@/lib/official-resources";
export const metadata={title:"My progress"};
export default function Page(){return <ProgressDashboard resources={getApprovedResources()}/>;}
