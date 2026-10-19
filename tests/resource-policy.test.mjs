import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { courses } from "../src/lib/courses.ts";
import { publishOfficialResources, resourcesForTopic, safeResourceUrl, youtubeVideoId } from "../src/lib/resource-policy.ts";
import { parseStudyData, STORAGE_KEY, THEME_KEY } from "../src/lib/study-storage.ts";

// Synthetic fixtures only. These are never imported by the app or sent to a provider.
const fixture = () => ({
  id: "test-resource", title: "Test-only reference", publisher: "Test fixture",
  description: "Synthetic policy test; not a real educational resource.",
  kind: "reading", url: "https://example.invalid/test-only",
  courseId: "chemistry", unitNumber: 1, topicIds: ["electron-configuration"],
  approval: { status: "approved", approvedBy: "owner", approvedOn: "2026-10-17", approvedUrl: "https://example.invalid/test-only", reference: "TEST-ONLY mock approval" },
});
const publish = (...resources) => publishOfficialResources({ resources }, courses);

test("the shipped catalog publishes only explicit owner approvals", () => {
  const config = JSON.parse(readFileSync(new URL("../src/config/official-resources.json", import.meta.url), "utf8"));
  const published = publishOfficialResources(config, courses);
  assert.deepEqual(published.map((resource) => resource.id), config.resources.filter((resource) => resource.approval.status === "approved").map((resource) => resource.id));
  for (const resource of published) assert.equal(resource.approval.approvedBy, "owner");
});
test("drafts never reach the public catalog", () => {
  const draft = { ...fixture(), approval: { status: "draft" } };
  assert.deepEqual(publish(draft), []);
  assert.ok(!JSON.stringify(publish(draft)).includes(draft.url));
});
test("a valid explicitly approved test entry passes the policy", () => {
  assert.equal(publish(fixture()).length, 1);
});
test("a changed URL cannot reuse a previous approval", () => {
  assert.throws(() => publish({ ...fixture(), url: "https://example.invalid/replacement" }), /exact URL/);
});
for (const approval of [undefined, { status: "pending" }, { status: "approved" }, { status: "approved", approvedBy: "assistant", approvedOn: "2026-10-17", reference: "test" }, { status: "approved", approvedBy: "owner", approvedOn: "2026-02-30", reference: "test" }, { status: "approved", approvedBy: "owner", approvedOn: "2026-10-17", reference: "" }]) {
  test(`missing or invalid approval fails closed: ${JSON.stringify(approval)}`, () => {
    assert.throws(() => publish({ ...fixture(), approval }), /approval|status/i);
  });
}
for (const url of ["javascript:alert(1)", "http://example.invalid", "https://user:secret@example.invalid", "not-a-url"]) {
  test(`unsafe URL rejected: ${url.split(":")[0]}`, () => {
    assert.equal(safeResourceUrl(url), false);
    assert.throws(() => publish({ ...fixture(), url }), /HTTPS/);
  });
}
test("resources resolve only to their exact course, unit, and topic", () => {
  const published = publish(fixture());
  assert.equal(resourcesForTopic(published, "chemistry", 1, "electron-configuration").length, 1);
  assert.equal(resourcesForTopic(published, "chemistry", 1, "moles").length, 0);
  assert.equal(resourcesForTopic(published, "biology", 1, "water").length, 0);
  assert.equal(resourcesForTopic(published, "chemistry", 2, "bonds").length, 0);
});
test("unit-wide resources appear across topics in that unit only", () => {
  const published = publish({ ...fixture(), topicIds: [] });
  assert.equal(resourcesForTopic(published, "chemistry", 1, "moles").length, 1);
  assert.equal(resourcesForTopic(published, "chemistry", 2, "bonds").length, 0);
});
test("unknown courses, units, topics, and duplicate IDs are rejected", () => {
  for (const patch of [{ courseId: "missing" }, { unitNumber: 99 }, { topicIds: ["water"] }]) assert.throws(() => publish({ ...fixture(), ...patch }));
  assert.throws(() => publish(fixture(), fixture()), /duplicate/);
});
test("YouTube parsing accepts exact videos, never playlists or lookalike hosts", () => {
  assert.equal(youtubeVideoId("https://www.youtube.com/watch?v=testVideo01&list=ignored"), "testVideo01");
  assert.equal(youtubeVideoId("https://youtu.be/testVideo01"), "testVideo01");
  for (const url of ["https://youtube.com/playlist?list=test", "https://youtube.com.evil.invalid/watch?v=testVideo01", "https://youtu.be/too-short", "http://youtu.be/testVideo01"]) assert.equal(youtubeVideoId(url), null);
});
test("video publication requires an explicit embed or link-only policy", () => {
  const video = { ...fixture(), kind: "video", url: "https://www.youtube.com/watch?v=testVideo01", approval: { ...fixture().approval, approvedUrl: "https://www.youtube.com/watch?v=testVideo01" } };
  assert.throws(() => publish(video), /embed policy/);
  for (const embedPolicy of ["allowed", "link-only"]) assert.equal(publish({ ...video, video: { provider: "youtube", embedPolicy } }).length, 1);
});
test("branding preserves legacy notes, courses, completion, bookmarks, and theme keys", () => {
  assert.equal(STORAGE_KEY, "ap-hub:v1");
  assert.equal(THEME_KEY, "ap-hub:theme");
  const legacy = { selected: ["chemistry", "biology"], notes: { "chemistry/electron-configuration": "My existing note" }, completed: ["chemistry/electron-configuration"], saved: ["openstax", "bozeman", "periodic-table"], lastTopic: "chemistry/electron-configuration" };
  assert.deepEqual(parseStudyData(legacy, courses), { ...legacy, watchedVideos: [] });
  assert.throws(() => parseStudyData({ ...legacy, notes: { broken: 123 } }, courses));
});
