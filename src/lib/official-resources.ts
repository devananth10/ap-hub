import "server-only";
import config from "@/config/official-resources.json";
import { courses } from "./courses";
import { publishOfficialResources, resourcesForTopic } from "./resource-policy";

// Draft metadata stays on the server. Client components receive only this filtered list.
const approved = publishOfficialResources(config, courses);
export function getApprovedResources() { return approved; }
export function getTopicResources(courseId: string, unitNumber: number, topicId: string) {
  return resourcesForTopic(approved, courseId, unitNumber, topicId);
}
