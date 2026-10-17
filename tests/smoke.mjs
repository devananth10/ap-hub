import assert from "node:assert/strict";

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
  ["/courses/chemistry/electron-configuration", "Atomic structure and electron configuration"],
  ["/courses/chemistry/moles", "This topic is on the roadmap"],
  ["/notes", "My notes"],
  ["/resources", "Saved resources"],
];
for (const [path, expected] of cases) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, `${path} should return 200`);
  const html = await response.text();
  assert.ok(html.includes(expected), `${path} should render ${expected}`);
  assert.ok(!html.includes("NEXT_REDIRECT"), `${path} should not redirect unexpectedly`);
  assert.ok(html.includes('lang="en"'), "Document language should be declared");
  console.log(`PASS ${path}`);
}
const home = await (await fetch(base)).text();
const css = home.match(/href="([^"]+\.css(?:\?[^"]*)?)"/);
assert.ok(css, "A compiled stylesheet should be linked");
const cssResponse = await fetch(new URL(css[1].replaceAll("&amp;", "&"), base));
assert.equal(cssResponse.status, 200, "The stylesheet should load");
assert.ok((await cssResponse.text()).includes("welcome-banner"), "App styles should be compiled");
console.log("PASS compiled CSS");
for (const path of ["/missing-page", "/courses/not-a-course", "/courses/chemistry/not-a-topic"]) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  assert.equal(response.status, 404, `${path} should return 404`);
  assert.ok(html.includes("in the syllabus"), "A friendly 404 should be rendered");
  console.log(`PASS 404 ${path}`);
}
console.log("16 smoke checks passed. See README for the browser interaction checklist.");
