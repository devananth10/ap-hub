import { notFound } from "next/navigation";
import { findTopic, topicKey } from "@/lib/courses";
import { lessons } from "@/lib/lessons";
import { StudyWorkspace } from "@/components/study-workspace";
import { getTopicResources } from "@/lib/official-resources";
import { practiceEntries } from "@/lib/practice";
import { getTopicSummary } from "@/lib/topic-summaries";

type Params = { params: Promise<{ courseId: string; topicId: string }> };
export async function generateMetadata({ params }: Params) {
  const { courseId, topicId } = await params;
  return { title: findTopic(courseId, topicId).topic?.title || "Topic not found" };
}
export default async function TopicPage({ params }: Params) {
  const { courseId, topicId } = await params;
  const { course, unit, topic } = findTopic(courseId, topicId);
  if (!course || !unit || !topic) notFound();
  return <StudyWorkspace key={`${courseId}/${topicId}`} course={course} unit={unit} topic={topic} lesson={lessons[topicKey(courseId, topicId)]} resources={getTopicResources(courseId, unit.number, topicId)} summary={getTopicSummary(courseId, topicId)} topicQuestions={practiceEntries({ courseId, unitNumber: unit.number, topicId })} />;
}
