import { notFound } from "next/navigation";
import { PracticeCenter } from "@/components/practice-center";
import { practiceEntries, validPracticeScope, type PracticeScope } from "@/lib/practice";

export const metadata = { title: "Practice" };
type Search = Record<string, string | string[] | undefined>;
export default async function PracticePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  if ([params.course, params.unit, params.topic].some((value) => Array.isArray(value))) notFound();
  const scope: PracticeScope = {
    ...(params.course ? { courseId: String(params.course) } : {}),
    ...(params.unit !== undefined ? { unitNumber: Number(params.unit) } : {}),
    ...(params.topic ? { topicId: String(params.topic) } : {}),
  };
  if (!validPracticeScope(scope)) notFound();
  return <PracticeCenter scope={scope} entries={practiceEntries(scope)} />;
}
