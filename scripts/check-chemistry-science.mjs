// Independent arithmetic checks for authored/revised numerical items.
// These do not prove conceptual validity, originality, or scientific completeness.
import assert from 'node:assert/strict';
const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
// Relative checks are essential for photon energies; an absolute 1e-8 J
// tolerance would incorrectly accept zero for an expected 1e-19 J result.
const relativeClose = (actual,expected,tolerance=1e-10) => assert.ok(Math.abs(actual-expected)<=Math.abs(expected)*tolerance,`${actual} != ${expected}`);

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
// Topic 2.4: model neutrality and the supplied alloy number ratios.
assert.equal(100 * 2 - 200, 0);
assert.deepEqual([80 / 20, 60 / 40], [4, 1.5]);
// Independently reconstruct Lewis bookkeeping from atom/edge lists, not saved keys.
const valence = {H:1,B:3,C:4,N:5,O:6,F:7,P:5,S:6,Cl:7,Br:7,Xe:8};
function lewis(elements, edges, lonePairs, charge = 0, exceptions = {}) {
  const orders = elements.map(() => 0);
  for (const [a,b,order] of edges) { orders[a] += order; orders[b] += order; }
  const budget = elements.reduce((sum,element) => sum + valence[element],0) - charge;
  const used = edges.reduce((sum,edge) => sum + 2 * edge[2],0) + lonePairs.reduce((sum,pairs) => sum + 2 * pairs,0);
  assert.equal(used,budget,'Lewis electron total');
  elements.forEach((element,index) => assert.equal(2 * orders[index] + 2 * lonePairs[index], exceptions[index] ?? (element === 'H' ? 2 : 8), `Occupancy at atom ${index}`));
  const charges = elements.map((element,index) => valence[element] - 2 * lonePairs[index] - orders[index]);
  assert.equal(charges.reduce((sum,value) => sum + value,0),charge);
  return charges;
}
lewis(['N','H','H','H','H'], [[0,1,1],[0,2,1],[0,3,1],[0,4,1]], [0,0,0,0,0],1); // 2.5 #001
lewis(['H','C','N'],[[0,1,1],[1,2,3]],[0,0,1]); // #002
lewis(['H','O','O','H'],[[0,1,1],[1,2,1],[2,3,1]],[0,2,2,0]); // #003
lewis(['O','C','O'],[[0,1,2],[1,2,2]],[2,0,2]); // #004
lewis(['C','F','F','F','F'],[[0,1,1],[0,2,1],[0,3,1],[0,4,1]],[0,3,3,3,3]); // #005
lewis(['P','H','H','H'],[[0,1,1],[0,2,1],[0,3,1]],[1,0,0,0]); // #006
lewis(['O','H','H','H'],[[0,1,1],[0,2,1],[0,3,1]],[1,0,0,0],1); // #007
lewis(['C','C','H','H','H','H'],[[0,1,2],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],[0,0,0,0,0,0]); // #008
lewis(['C','C','O','H','H','H','H','H','H'],[[0,1,1],[1,2,1],[2,3,1],[0,4,1],[0,5,1],[0,6,1],[1,7,1],[1,8,1]],[0,0,2,0,0,0,0,0,0]); // #009 ethanol
lewis(['C','O','C','H','H','H','H','H','H'],[[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[2,6,1],[2,7,1],[2,8,1]],[0,2,0,0,0,0,0,0,0]); // ether
lewis(['N','N','H','H','H','H'],[[0,1,1],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],[1,1,0,0,0,0]); // #010
lewis(['B','F','F','F'],[[0,1,1],[0,2,1],[0,3,1]],[0,3,3,3],0,{0:6}); // #011 explicit B exception
// Topic 2.6: derive formal charges from assigned electron shares.
assert.deepEqual(lewis(['O','O','O'],[[0,1,2],[1,2,1]],[2,1,3]),[0,1,-1]);
assert.deepEqual(lewis(['C','O','O','O'],[[0,1,2],[0,2,1],[0,3,1]],[0,2,3,3],-2),[0,0,-1,-1]);
close((2+1+1)/3,4/3);
assert.deepEqual(lewis(['O','H'],[[0,1,1]],[3,0],-1),[-1,0]);
assert.equal(5 + 2*6,17); assert.equal(17 % 2,1); // NO2 odd electron total
assert.deepEqual(lewis(['O','C','N'],[[0,1,1],[1,2,3]],[3,0,1],-1),[-1,0,0]);
assert.deepEqual(lewis(['O','C','N'],[[0,1,2],[1,2,2]],[2,0,2],-1),[0,0,-1]);
assert.deepEqual(lewis(['N','O','O'],[[0,1,2],[0,2,1]],[1,2,3],-1),[0,0,-1]);
assert.deepEqual(lewis(['S','F','F','F','F','F','F'],[[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1]],[0,3,3,3,3,3,3],0,{0:12}),[0,0,0,0,0,0,0]);
assert.deepEqual(lewis(['C','O'],[[0,1,3]],[1,1]),[-1,1]);
assert.deepEqual(lewis(['N','O','O','O'],[[0,1,2],[0,2,1],[0,3,1]],[0,2,3,3],-1),[1,0,-1,-1]);
assert.throws(() => lewis(['N','O','O','O'],[[0,1,2],[0,2,2],[0,3,1]],[0,2,2,3],-1),/Occupancy at atom 0/);
// Topic 2.7: count the domains and electrons before assigning geometries.
for (const [element,bonds,pairs] of [['P',5,0],['S',4,1],['Cl',3,2],['Xe',4,2],['Br',5,1]]) {
  lewis([element,...Array(bonds).fill('F')],Array.from({length:bonds},(_,i)=>[0,i+1,1]),[pairs,...Array(bonds).fill(3)],0,{0:2*(bonds+pairs)});
}
lewis(['C','C','H','H'],[[0,1,3],[0,2,1],[1,3,1]],[0,0,0,0]);
assert.deepEqual([3,2],[2+1,3-1]); // C2H2 sigma/pi totals
lewis(['C','C','N','H','H','H'],[[0,1,1],[1,2,3],[0,3,1],[0,4,1],[0,5,1]],[0,0,1,0,0,0]);
const vectorSum = vectors => vectors.reduce((sum,vector)=>sum.map((value,index)=>value+vector[index]),[0,0,0]);
const bf3 = [0,2*Math.PI/3,4*Math.PI/3].map(angle=>[Math.cos(angle),Math.sin(angle),0]);
vectorSum(bf3).forEach(value=>close(value,0));
assert.deepEqual(vectorSum([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]),[0,0,0]); // XeF4
assert.notDeepEqual(vectorSum([[1,1,1],[1,-1,-1],[-1,1,-1]]),[0,0,0]); // three tetrahedral directions, NH3 model
// Topic 3.1: controlled electrostatic models check orientation/induction signs.
// Arbitrary consistent units; these are NOT measured molecular energies.
const crossEnergy = (first,second) => first.reduce((sum,[x,q])=>sum+second.reduce((sub,[y,p])=>sub+q*p/Math.abs(x-y),0),0);
assert.ok(crossEnergy([[0,1],[1,-1]],[[3,1],[4,-1]]) < 0); // head to tail
assert.ok(crossEnergy([[0,-1],[1,1]],[[3,1],[4,-1]]) > 0); // head to head
assert.ok(-1/2 + 1/4 < 1/2 - 1/4); // negative dipole end nearer a cation
const inducedEnergy = (alpha,field) => -.5*alpha*field**2;
assert.ok(inducedEnergy(2,2) < inducedEnergy(2,1)); // larger field strengthens attraction
// Topic 3.4: separate ideal-gas and mixture calculations from prompt inputs.
close(1.20 * 2.00 / 3.00 * 450.0 / 300.0,1.20);
close((1-.750/1.00)*100,25);
close(.982-.0313,.9507);
close(.820 * .08206 * 300.0 / (1.00*.500),40.37352);
close(.200/(.200+.300)*2.50,1.00);
close((127+273.15)/(27+273.15),1.3331667499583542);
close((2.00*1.00+1.00*3.00)/4.00,1.25);
assert.ok(330/300>1); // warm gas analyzed with a lower temperature overestimates n
// Topic 3.5: RMS scaling and normalized Maxwell energy distributions (kB=1).
close(Math.sqrt(800/200),2);
close(Math.sqrt(4/1),2);
const energyDensity = (energy,temp) => 2/Math.sqrt(Math.PI)*Math.sqrt(energy)/(temp**1.5)*Math.exp(-energy/temp);
function integrate(fn,left,right,steps=20000) {
  const h=(right-left)/steps;
  let sum=fn(left)+fn(right);
  for(let i=1;i<steps;i++) sum+=(i%2 ? 4 : 2)*fn(left+i*h);
  return sum*h/3;
}
for(const temp of [1,2]) {
  close(integrate(energy=>energyDensity(energy,temp),0,100),1,.001);
  close(integrate(energy=>energy*energyDensity(energy,temp),0,100),1.5*temp,.001);
}
assert.ok(integrate(energy=>energyDensity(energy,2),3,100)>integrate(energy=>energyDensity(energy,1),3,100));
close((2+(-2))/2,0); close((2**2+(-2)**2)/2,4);
// Topic 3.6: distinguish a volume-input error from intrinsic nonideality,
// and check molar-mass error direction for a sub-ideal measured pressure.
const idealPressure = (amount,temp,volume) => amount*.08206*temp/volume;
assert.ok(idealPressure(1,300,1.6)>idealPressure(1,300,2));
const trueMass = 40, amount = .100, temp = 300, volume = 2;
const measuredPressure=.9*idealPressure(amount,temp,volume);
const estimatedMolarMass=(trueMass*amount)*.08206*temp/(measuredPressure*volume);
close(estimatedMolarMass/trueMass,1/.9);
assert.ok(estimatedMolarMass>trueMass);
// Topic 3.7: molarity, conservation on dilution/mixing, and species counts.
close(.150/.750,.200);
close(.100*.250*101.1,2.5275);
close(.400*25.0/100.0,.100);
close((.1000*.200+.3000*.400)/.4000,.350);
close(.100*2,.200);
close(.200*.250*6.022,.3011); // ×10^23 molecules
assert.ok(.050/.251 < .050/.250); // overfilling at fixed amount
close(.0500/.200,.250);
close((.0500*.200+.0500*.100)/.1000,.150);
// Topic 3.8: particulate amount/volume scales and conservation of ionic species.
close((6/1)/(9/3),2);
const ionicCharge = counts => counts.Na - counts.Cl + counts.K - 2*counts.sulfate;
const combined = {Na:4,Cl:4,K:4,sulfate:2};
assert.equal(ionicCharge(combined),0);
assert.equal(ionicCharge({Na:4,Cl:4,K:2,sulfate:4}),-6);
close((6/2)/(6/1),.5);
assert.equal(2*1+2*(-1),0); // one Ca2+ and two Cl−
// Topic 3.9: normalized migration uses a common origin and is dimensionless.
close(2.4/8.0,.30);
assert.ok(2.4/8.0>=0 && 2.4/8.0<=1);
// Topic 3.12: given rounded constants, per-photon/mole units, and level gaps.
const planck=6.626e-34, lightSpeed=3.00e8, avogadro=6.022e23;
assert.throws(()=>relativeClose(0,2.6504e-19)); // reject a zero result, unlike an oversized absolute tolerance
relativeClose(lightSpeed/(500e-9),6.00e14);
relativeClose(planck*4.00e14,2.6504e-19);
close((planck*lightSpeed/(400e-9))/(planck*lightSpeed/(800e-9)),2);
close(5-2,3); close(2-6,-4);
relativeClose(planck*lightSpeed/(3.00e-19),6.626e-7);
relativeClose(3.20e-19*avogadro/1000,192.704);
close((4-1)+(1-0),4);
const energy400=planck*lightSpeed/(400e-9), energy800=planck*lightSpeed/(800e-9);
close((10/energy800)/(10/energy400),2);
// Topic 3.13: Beer-Lambert products, calibration, dilution, and units.
close(150*2.00*.00300,.900);
close(.150/.00200,75); close(.300/.00400,75);
close(.225/75,.00300);
close(1.20*10/50,.240);
close(2*.5,1);
close(220/110,2);
assert.ok(.6/75 > .5/75); // extra apparent absorbance at fixed positive slope
close(1/2,.5); // equal A and b, epsilonP=2 epsilonQ
// Topic 4.2: supplied species and stoichiometric vectors, including charge.
// Formula parsing is intentionally limited to simple formulas used below;
// this verifies accounting, not solubility, speciation, or chemical feasibility.
function formulaAtoms(formula) {
  const tokens=formula.match(/[A-Z][a-z]?|\d+|[()]/g) || [];
  assert.equal(tokens.join(''),formula);
  let cursor=0;
  function group(nested=false) {
    const counts={};
    while(cursor<tokens.length && tokens[cursor]!==')') {
      let part;
      if(tokens[cursor]==='(') { cursor++; part=group(true); }
      else { assert.match(tokens[cursor],/^[A-Z][a-z]?$/); part={[tokens[cursor++]]:1}; }
      const multiple=/^\d+$/.test(tokens[cursor] || '') ? Number(tokens[cursor++]) : 1;
      for(const [element,count] of Object.entries(part)) counts[element]=(counts[element] || 0)+count*multiple;
    }
    if(nested) { assert.equal(tokens[cursor],')'); cursor++; }
    return counts;
  }
  const result=group(); assert.equal(cursor,tokens.length); return result;
}
const equationSide = terms => {
  const totals={charge:0};
  for(const [coefficient,formula,charge=0] of terms) {
    totals.charge+=coefficient*charge;
    for(const [element,count] of Object.entries(formulaAtoms(formula))) totals[element]=(totals[element] || 0)+coefficient*count;
  }
  return Object.fromEntries(Object.entries(totals).sort(([a],[b])=>a.localeCompare(b)));
};
const balanced=(left,right)=>JSON.stringify(equationSide(left))===JSON.stringify(equationSide(right));
assert.ok(balanced([[1,'Ba',2],[1,'SO4',-2]],[[1,'BaSO4']]));
assert.ok(balanced([[2,'Ag',1],[2,'NO3',-1],[1,'Ca',2],[2,'Cl',-1]],[[2,'AgCl'],[1,'Ca',2],[2,'NO3',-1]]));
assert.ok(balanced([[1,'CH3COOH'],[1,'OH',-1]],[[1,'CH3COO',-1],[1,'H2O']]));
assert.ok(!balanced([[1,'CH3COOH'],[1,'OH',-1]],[[1,'CH3COO',-1],[1,'H2']]));
assert.ok(balanced([[1,'Al2(SO4)3']],[[2,'Al',3],[3,'SO4',-2]]));
assert.ok(!balanced([[1,'Al2(SO4)3']],[[2,'Al',3],[1,'SO4',-2]]));
assert.ok(balanced([[2,'C2H6'],[7,'O2']],[[4,'CO2'],[6,'H2O']]));
for(const [fuel,oxygen,carbonDioxide,water] of [[1,3,2,3],[2,5,4,6],[1,7,2,6]])
  assert.ok(!balanced([[fuel,'C2H6'],[oxygen,'O2']],[[carbonDioxide,'CO2'],[water,'H2O']]));
assert.ok(balanced([[1,'Zn'],[2,'Ag',1]],[[1,'Zn',2],[2,'Ag']]));
assert.ok(!balanced([[1,'Zn'],[1,'Ag',1]],[[1,'Zn',2],[1,'Ag']]));
assert.ok(!balanced([[2,'Zn'],[1,'Ag',1]],[[2,'Zn',2],[1,'Ag']]));
assert.ok(balanced([[1,'Fe',2],[1,'Ce',4]],[[1,'Fe',3],[1,'Ce',3]]));
assert.ok(balanced([[1,'CaCO3'],[2,'H',1]],[[1,'Ca',2],[1,'CO2'],[1,'H2O']]));
assert.ok(!balanced([[1,'CaCO3'],[1,'H',1]],[[1,'Ca',2],[1,'CO2'],[1,'H2O']]));
assert.ok(balanced([[3,'Ca',2],[2,'PO4',-3]],[[1,'Ca3(PO4)2']]));
assert.ok(balanced([[6,'Ca',2],[4,'PO4',-3]],[[2,'Ca3(PO4)2']])); // valid but not primitive
assert.equal([6,4,2].every(coefficient=>coefficient%2===0),true);
// Topic 4.3: complete before/after particle inventories, including excess/spectators.
assert.ok(balanced([[4,'Ag',1],[4,'NO3',-1],[6,'Na',1],[6,'Cl',-1]],[[4,'AgCl'],[4,'NO3',-1],[6,'Na',1],[2,'Cl',-1]]));
assert.ok(balanced([[6,'H2O']],[[6,'H2'],[3,'O2']]));
assert.ok(!balanced([[6,'H2O']],[[6,'H2'],[6,'O2']]));
assert.ok(balanced([[6,'CO'],[4,'O2']],[[6,'CO2'],[1,'O2']]));
assert.equal(4-6/2,1); // leftover oxygen
assert.ok(!balanced([[6,'CO'],[4,'O2']],[[6,'CO2']]));
assert.ok(balanced([[2,'CaCl2']],[[2,'Ca',2],[4,'Cl',-1]]));
assert.ok(balanced([[8,'NO2']],[[4,'N2O4']]));
assert.ok(balanced([[3,'NH4NO3']],[[3,'NH4',1],[3,'NO3',-1]]));
assert.ok(balanced([[2,'Fe'],[4,'Cu',2],[4,'SO4',-2]],[[2,'Cu'],[2,'Fe',2],[2,'Cu',2],[4,'SO4',-2]]));
assert.ok(!balanced([[2,'Fe'],[4,'Cu',2],[4,'SO4',-2]],[[2,'Cu'],[2,'Fe',3],[2,'Cu',2],[4,'SO4',-2]]));
assert.equal(3-2,1); // leftover hydroxide in the simplified HA frame
assert.equal(-2-1+3,0); // two A−, one OH− and three Na+
// Topic 4.4: accounting for the specified transformations (not a mechanism).
assert.ok(balanced([[1,'HCl'],[1,'H2O']],[[1,'H3O',1],[1,'Cl',-1]]));
assert.ok(balanced([[2,'H2O2']],[[2,'H2O'],[1,'O2']]));
assert.ok(balanced([[3,'O2']],[[2,'O3']]));
console.log('Implemented numerical and scientific-model checks passed. See per-topic QA for coverage, qualitative review, and human-review limits.');
