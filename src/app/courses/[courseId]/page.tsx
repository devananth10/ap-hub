import { notFound } from "next/navigation";
import { courses } from "@/lib/courses";
import { CourseOutline } from "@/components/course-outline";
import { getApprovedResources } from "@/lib/official-resources";
import { courseWithResources } from "@/lib/resource-policy";
export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return { title: courses.find((course) => course.id === courseId)?.title || "Course not found" };
}
export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = courses.find((item) => item.id === courseId);
  if (!course) notFound();
  return <CourseOutline course={courseWithResources(course, getApprovedResources())} />;
}
