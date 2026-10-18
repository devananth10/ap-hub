import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { courses } from "../src/lib/courses.ts";
import { academicThemes } from "../src/lib/artwork.ts";

const catalog = JSON.parse(readFileSync(new URL("../src/config/official-resources.json", import.meta.url), "utf8"));
const approved = catalog.resources.filter((resource) => resource.approval?.status === "approved");
const draftUrls = catalog.resources.filter((resource) => resource.approval?.status !== "approved").map((resource) => resource.url);
const chemistryResources = approved.filter((resource) => resource.courseId === "chemistry" && resource.unitNumber === 1 && (!resource.topicIds.length || resource.topicIds.includes("electron-configuration")));
const withdrawnUrls = [
  "https://www.youtube.com/watch?v=2AFPfg0Como",
  "https://www.bozemanscience.com/ap-chem-005-electron-configuration",
  "https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations",
  "https://www.rsc.org/periodic-table",
].filter((url) => !approved.some((resource) => resource.url === url));

const base = process.env.BASE_URL || "http://127.0.0.1:3000";
const cases = [
  ["/", "Your space to understand."],
  ["/courses", "My courses"],
  ["/courses/chemistry", "Atomic Structure and Properties"],
  ["/courses/biology", "Chemistry of Life"],
  ["/courses/calculus-ab", "Limits and Continuity"],
  ["/courses/physics-1", "Kinematics"],
  ["/courses/english-language", "Rhetorical Foundations"],
  ["/courses/us-history", "1491"],
  ["/courses/chemistry/electron-configuration", "Atomic Structure and Electron Configuration"],
  ["/courses/chemistry/moles", "11 MCQs are ready for this topic"],
  ["/courses/chemistry/mass-spectra", "11 MCQs are ready for this topic"],
  ["/notes", "My notes"],
  ["/resources", "Saved resources"],
  ["/practice", "Practice with purpose."],
  ["/practice?course=chemistry", "1001 MCQ questions"],
  ["/practice?course=chemistry&unit=1", "88 MCQ questions"],
  ["/practice?course=chemistry&unit=1&topic=moles", "11 MCQ questions"],
  ["/practice?course=chemistry&unit=1&topic=electron-configuration", "11 MCQ questions"],
  ["/practice?course=biology", "Practice is coming to this scope."],
];
for (const [path, expected] of cases) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, `${path} should return 200`);
  const html = await response.text();
  assert.ok(html.replace(/<!--.*?-->/g, "").includes(expected), `${path} should render ${expected}`);
  assert.ok(!html.includes("NEXT_REDIRECT"), `${path} should not redirect unexpectedly`);
  assert.ok(html.includes('lang="en"'), "Document language should be declared");
  assert.ok(html.includes("PrepAtlas"), `${path} should use PrepAtlas branding`);
  assert.ok(!/AP Hub|APHub|StudyHub/.test(html), `${path} should not render old branding`);
  for (const url of [...draftUrls, ...withdrawnUrls]) assert.ok(!html.replaceAll("&amp;", "&").includes(url), `${path} should not expose an unapproved or withdrawn URL`);
  assert.ok(!/youtube-nocookie\.com\/embed\//.test(html), `${path} should not embed an unapproved video`);
  assert.ok(!html.includes("PREPATLAS MCQ") && !html.includes("OWNER-APPROVED"), "Question approval badges should never be rendered");
  if (path === "/courses/chemistry/electron-configuration") {
    if (!chemistryResources.some((resource) => resource.kind === "video")) assert.ok(html.includes("No approved videos yet"), "Video area should explain the approval state");
    if (!chemistryResources.length) assert.ok(html.includes("No approved resources yet"), "Resource area should explain the approval state");
    assert.ok(!html.includes('id="topic-notes"'), "Notes should be hidden by default");
  }
  if (path === "/practice?course=chemistry&unit=1&topic=moles") {
    assert.ok(html.replace(/<!--.*?-->/g, "").includes("Question 1 of 11"), "Question navigation should show the full set");
    assert.ok(html.includes("This is not an official College Board question"), "Practice must not be presented as official College Board questions");
  }
  console.log(`PASS ${path}`);
}
const home = await (await fetch(base)).text();
const css = home.match(/href="([^"]+\.css(?:\?[^"]*)?)"/);
assert.ok(css, "A compiled stylesheet should be linked");
const cssResponse = await fetch(new URL(css[1].replaceAll("&amp;", "&"), base));
assert.equal(cssResponse.status, 200, "The stylesheet should load");
assert.ok((await cssResponse.text()).includes("welcome-banner"), "App styles should be compiled");
console.log("PASS compiled CSS");
for (const path of ["/missing-page", "/courses/not-a-course", "/courses/chemistry/not-a-topic", "/practice?course=missing", "/practice?unit=1", "/practice?course=biology&unit=1&topic=electron-configuration", "/practice?course=chemistry&course=biology"]) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  assert.equal(response.status, 404, `${path} should return 404`);
  assert.ok(html.includes("in the syllabus"), "A friendly 404 should be rendered");
  console.log(`PASS 404 ${path}`);
}
for (const course of courses) {
  const html = await (await fetch(`${base}/courses/${course.id}`)).text();
  assert.ok(html.includes(`data-course-art="${course.artwork}"`), `${course.id} should have fixed subject art`);
  assert.ok(!html.includes("data-dashboard-art"), "Course art should not be randomized");
  assert.ok(html.includes(`/practice?course=${course.id}`), "Each course should link to scoped practice");
}
console.log("PASS all six fixed course themes and practice entry points");
const draws = new Set();
for (let index = 0; index < 12; index++) {
  const html = await (await fetch(base, { cache: "no-store" })).text();
  const theme = html.match(/data-dashboard-art="([^"]+)"/)?.[1];
  assert.ok(academicThemes.some((item) => item.id === theme), "Dashboard art must come from the academic pool");
  draws.add(theme);
}
assert.ok(draws.size > 1, "Fresh home responses should draw different academic subjects");
console.log(`PASS homepage randomization (${draws.size} themes across 12 fresh responses)`);
console.log(`${cases.length} page routes, CSS, seven 404s, six fixed course themes, and homepage randomization passed. See README for browser checks.`);
