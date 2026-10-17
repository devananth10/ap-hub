import { ResourcesPage } from "@/components/library-pages";
import { getApprovedResources } from "@/lib/official-resources";
export const metadata = { title: "Saved resources" };
export default function SavedResources() { return <ResourcesPage resources={getApprovedResources()} />; }
