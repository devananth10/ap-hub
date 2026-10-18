// Independent arithmetic checks for authored/revised numerical items.
// These do not prove conceptual validity, originality, or scientific completeness.
import assert from 'node:assert/strict';
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

// Existing approved Topic 1.1: no edits; independently recalculate supplied data.
close(8.80 / 44.0 * 6.022, 1.2044); // ×10^23 molecules, #002
close(.250 * 2 * 6.022, 3.011); // ×10^23 chloride ions, #003
close(28.0 / 2, 14.0); // grams N2, #004
assert.ok([28,32,44].every(mass => 16 / 16 > 16 / mass)); // #005
close(.500 * 8 * 6.022, 24.088); // ×10^23 O atoms, #006
close(3.011 / 6.022 * 58.44, 29.22); // #007
close(30.97 ** 2, 959.1409); // #008 distractor
close((20 / 40.1) / (20 / 65.4), 1.630922693266833); // #009
close(1.27 / 63.5 * 6.022, .12044); // ×10^23 atoms, #010

// Topic 1.1 #011: derive from the balance reading before consulting its key.
const sampleMass = 6.350 - 0.250;
close(sampleMass, 6.100);
close(sampleMass / 63.50, 0.09606299212598425);
close(0.1000 * 63.50 - sampleMass, 0.250);

// Recovered Topic 1.4: independently reconstruct each quantitative result.
close(3.55 * (23.0 + 35.5) / 35.5 / 10.0 * 100, 58.5); // #002
close((80 * .20 - 25 * .20) / (80 - 25) * 100, 20); // #003
close((.200 * 12 + .200 * 12) / (.200 * 28 + .200 * 44) * 100, 100 / 3); // #004
close(.36 / .40 * 100, 90); // #006
close(60 / (20 + 60) * 100, 75); // #007
close((2.2 * 32 / 44 + 3.2) / (2.2 + 3.2) * 100, 88.88888888888889); // #008
assert.ok(0 < 30 && 30 < 39.7); // #010: Mg dilutes oxygen fraction; the other candidates raise it.
close(20 * .15, 3); // #011
// Topic 1.5: electron accounting and force scaling, independently of answer keys.
assert.equal(10 + 2 + 3, 15); // P
assert.equal(8 + 2, 10); // O2−
assert.equal(2 + 2 + 6, 10); // S core
assert.equal(2 + 4, 6); // S valence
assert.equal(18 + 1, 19); // K
assert.equal(26 - 3, 18 + 5); // Fe3+
close(2 / (2 ** 2), .5);
assert.deepEqual([17 + 18, 17 - 18], [35, -1]); // Cl isotope/charge
assert.equal(18 + 2, 20); // Ca from Ca2+

// Topic 1.8: integer neutrality and particle-to-mole ratio checks.
for (const [positive, negative, cations, anions] of [[1,-2,2,1],[2,-3,3,2],[2,-1,1,2],[1,-2,2,1]]) {
  assert.equal(positive * cations + negative * anions, 0);
}
close(.250 * 2, .500);
console.log('Independent arithmetic/charge checks passed for Topics 1.1, 1.4, 1.5, and 1.8. See per-topic QA for conceptual checks and limitations.');
