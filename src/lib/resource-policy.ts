import type { Course } from "./courses.ts";
import { humanGeographyInstructors, isInstructorId, type InstructorId } from "./video-instructors.ts";

export type ResourceApproval =
  | { status: "draft" }
  | { status: "approved"; approvedBy: "owner"; approvedOn: string; approvedUrl: string; reference: string };

export type OfficialResource = {
  id: string;
  title: string;
  publisher: string;
  description: string;
  kind: "video" | "reading" | "guide" | "reference";
  url: string;
  courseId: string;
  unitNumber: number;
  /** An empty array associates a resource with the whole unit. */
  topicIds: string[];
  visibility?: "published" | "hidden";
  order?: number;
  part?: string;
  instructorId?: InstructorId;
  source?: { directory: string; labels: string[]; checkedOn: string; verification: string };
  approval: ResourceApproval;
  video?: { provider: "youtube"; embedPolicy: "allowed" | "link-only"; videoId?: string };
};
export type PublishedResource = OfficialResource & {
  approval: Extract<ResourceApproval, { status: "approved" }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function nonempty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
export function safeResourceUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

/** Extract one exact video ID; never import a playlist or fetch provider data. */
export function youtubeVideoId(value: string): string | null {
  if (!safeResourceUrl(value)) return null;
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  const id = host === "youtu.be" ? url.pathname.slice(1)
    : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host) && url.pathname === "/watch"
      ? url.searchParams.get("v")
      : null;
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/** Validate all entries and fail closed. Only owner-approved entries are published. */
export function publishOfficialResources(config: unknown, courses: Course[]): PublishedResource[] {
  if (!isRecord(config) || !Array.isArray(config.resources)) throw new Error("Official resource config must contain a resources array.");
  const ids = new Set<string>();
  const videoIds = new Set<string>();
  const published: PublishedResource[] = [];
  for (const entry of config.resources) {
    const fail = (reason: string): never => { throw new Error(`Official resource ${isRecord(entry) && typeof entry.id === "string" ? entry.id : "(unknown)"}: ${reason}`); };
    if (!isRecord(entry)) fail("entry must be an object.");
    const value = entry as Record<string, unknown>;
    if (!nonempty(value.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id)) fail("use a stable lowercase resource id.");
    const id = value.id as string;
    if (ids.has(id)) fail("duplicate id.");
    ids.add(id);
    if (value.visibility !== undefined && !["published", "hidden"].includes(String(value.visibility))) fail("visibility must be published or hidden.");
    if (value.order !== undefined && (typeof value.order !== "number" || !Number.isInteger(value.order) || value.order < 0)) fail("order must be a nonnegative integer.");
    if (value.part !== undefined && !nonempty(value.part)) fail("part must be nonempty when supplied.");
    if (value.instructorId !== undefined && (value.courseId !== "human-geography" || value.kind !== "video" || !isInstructorId(value.instructorId))) fail("instructorId must identify a supported Human Geography video instructor.");
    if (value.courseId === "human-geography" && value.kind === "video") {
      const instructor = humanGeographyInstructors.find(item => item.id === value.instructorId);
      if (!instructor || instructor.publisher !== value.publisher) fail("Human Geography videos require a matching instructorId and publisher.");
    }
    if (value.source !== undefined && (!isRecord(value.source) || !safeResourceUrl(value.source.directory) || !Array.isArray(value.source.labels) || !value.source.labels.every(nonempty) || !nonempty(value.source.checkedOn) || !nonempty(value.source.verification))) fail("source provenance is incomplete.");
    if (!["title", "publisher", "description"].every((key) => nonempty(value[key]))) fail("title, publisher, and description are required.");
    if (!["video", "reading", "guide", "reference"].includes(String(value.kind))) fail("unknown resource kind.");
    if (!safeResourceUrl(value.url)) fail("use an HTTPS URL without embedded credentials.");
    const course = courses.find((item) => item.id === value.courseId);
    const unit = course?.units.find((item) => item.number === value.unitNumber);
    if (!course || !unit) fail("course or unit does not exist.");
    if (!Array.isArray(value.topicIds) || !value.topicIds.every((id: unknown) => typeof id === "string" && unit!.topics.some((topic) => topic.id === id))) fail("topicIds must belong to the specified unit (or be empty for a unit-wide resource).");
    if (!isRecord(value.approval) || !["draft", "approved"].includes(String(value.approval.status))) fail("explicit draft or approved status is required.");
    const approval = value.approval as Record<string, unknown>;
    if (approval.status === "approved") {
      if (approval.approvedBy !== "owner" || !nonempty(approval.reference) || typeof approval.approvedOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(approval.approvedOn) || Number.isNaN(Date.parse(approval.approvedOn)) || new Date(approval.approvedOn).toISOString().slice(0, 10) !== approval.approvedOn) fail("approval needs owner, a valid date, and a reference to explicit owner approval of this exact URL.");
      if (approval.approvedUrl !== value.url) fail("approval must record this exact URL; replacing a URL requires fresh owner approval.");
    }
    if (value.kind === "video") {
      if (!isRecord(value.video) || value.video.provider !== "youtube" || !["allowed", "link-only"].includes(String(value.video.embedPolicy)) || !youtubeVideoId(value.url as string)) fail("video must specify one YouTube video and an explicit embed policy.");
      const settings = value.video as Record<string, unknown>;
      const videoId = youtubeVideoId(value.url as string)!;
      if (settings.videoId !== undefined && settings.videoId !== videoId) fail("videoId must match the URL.");
      const identity = `${value.courseId}:${videoId}`;
      if (videoIds.has(identity)) fail("duplicate video ID; use multiple topicIds on one resource instead.");
      videoIds.add(identity);
    } else if (value.video !== undefined) fail("only video resources can specify video settings.");
    if (approval.status === "approved" && value.visibility !== "hidden") published.push(entry as PublishedResource);
  }
  return published;
}

export function resourcesForTopic(resources: PublishedResource[], courseId: string, unitNumber: number, topicId: string) {
  return resources.filter((resource) => resource.courseId === courseId && resource.unitNumber === unitNumber && (resource.topicIds.length === 0 || resource.topicIds.includes(topicId))).sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Moving/reordering a resource retains progress; replacing its video does not. */
export function watchedVideoKey(resource: Pick<OfficialResource, "id" | "url">) {
  const videoId = youtubeVideoId(resource.url);
  return videoId ? `${resource.id}:${videoId}` : null;
}

export function courseWithResources(course: Course, resources: PublishedResource[]): Course {
  return { ...course, units: course.units.map(unit => ({ ...unit, topics: unit.topics.map(topic => ({ ...topic,
    ready: topic.ready || resourcesForTopic(resources, course.id, unit.number, topic.id).some(resource => resource.kind === "video"),
  })) })) };
}
