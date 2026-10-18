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
    if(formula==='e') { assert.equal(charge,-1); continue; } // electron has charge, no nuclei
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
// Topic 4.5: separately compute amounts from the supplied prompt inputs.
{
  const extent=Math.min(.400/2,.450/3);
  close(2*extent,.300); close(.400-2*extent,.100);
  close(25*.800/100.1*44.01,8.793206793206793);
  close(12.25/122.5*(3/2)*.08206*300,3.6927);
  close((.150*.400-3*.100*.100)/.250,.120);
  close(Math.min(.0200*.150,.0300*.0800)*143.32,.343968);
  close(5.60/56.0*(3/2)*28,4.20);
  const theoreticalCopper=10.00/79.55*63.55;
  close(theoreticalCopper,7.988686360779384);
  close(6.80/theoreticalCopper*100,85.12037765538946);
  assert.deepEqual([5,3,4].map(coefficient=>Number((.200*coefficient).toFixed(3))),[1,.6,.8]);
  close(4.20/(.100*40.30)*100,104.21836228287841);
  close(2*Math.min(2.00/2,.750),1.50);
  close(2*Math.min(4.00/2,.750),1.50);
  const hydrogen=(1.000-.0300)*.500/(.08206*300);
  close(hydrogen*(2/3)*26.98,.3543558913532104);
  close(1.000*.500/(.08206*300)*(2/3)*26.98,.3653153519105262);
  close(hydrogen*26.98,.5315338370298156);
  close(hydrogen*(3/2)*26.98,.7973007555447234);
  assert.ok(balanced([[2,'Al'],[3,'Cl2']],[[2,'AlCl3']]));
  assert.ok(balanced([[1,'CaCO3']],[[1,'CaO'],[1,'CO2']]));
  assert.ok(balanced([[2,'KClO3']],[[2,'KCl'],[3,'O2']]));
  assert.ok(balanced([[1,'H3PO4'],[3,'OH',-1]],[[1,'PO4',-3],[3,'H2O']]));
  assert.ok(balanced([[1,'Fe2O3'],[3,'CO']],[[2,'Fe'],[3,'CO2']]));
  assert.ok(balanced([[1,'CuO'],[1,'H2']],[[1,'Cu'],[1,'H2O']]));
  assert.ok(balanced([[1,'C3H8'],[5,'O2']],[[3,'CO2'],[4,'H2O']]));
  assert.ok(balanced([[2,'Mg'],[1,'O2']],[[2,'MgO']]));
  assert.ok(balanced([[2,'Al'],[6,'HCl']],[[2,'AlCl3'],[3,'H2']]));
}
// Topic 4.6: equivalence amounts and controlled examples of error directions.
{
  close(.1250*.01840/.02000,.1150);
  close(2*.01000*.0800/.1000*1000,16.0);
  close(.0200*.01250/.00500,.0500);
  close(24.65-3.15,21.50);
  close(.1000*((24.65-3.15)/1000)/.02500,.0860);
  const analyte=.00200;
  close(analyte/.1000,(analyte/.07500)*(.07500/.1000)); // known amount, fixed reagent concentration
  const weakerActual=.0800, assumed=.1000;
  const neededVolume=analyte/weakerActual;
  assert.ok(assumed*neededVolume>analyte);
  const flaskVolume=analyte/.1000, tipFill=.00020;
  assert.ok(.1000*(flaskVolume+tipFill)>analyte);
  close(.400/(.400/20),20); // mmol / (mmol/mL), graph corner
  assert.ok(balanced([[1,'H2A'],[2,'OH',-1]],[[1,'A',-2],[2,'H2O']])); // A is a symbolic conserved group
}
// Topic 4.7: reaction accounting and changes in formal oxidation numbers.
assert.ok(balanced([[1,'NH3'],[1,'H3O',1]],[[1,'NH4',1],[1,'H2O']]));
assert.ok(balanced([[1,'Pb',2],[2,'I',-1]],[[1,'PbI2']]));
assert.ok(balanced([[1,'C2H5OH'],[3,'O2']],[[2,'CO2'],[3,'H2O']]));
assert.ok(balanced([[1,'CO3',-2],[2,'H',1]],[[1,'CO2'],[1,'H2O']]));
assert.ok(balanced([[1,'Zn'],[2,'H',1]],[[1,'Zn',2],[1,'H2']]));
assert.ok(balanced([[2,'Fe',2],[1,'Cl2']],[[2,'Fe',3],[2,'Cl',-1]]));
assert.ok(balanced([[1,'SO2'],[2,'H2S']],[[3,'S'],[2,'H2O']]));
assert.equal(2*((-1)-(-2)),2*(0-(-1))); // peroxide: formal electrons gained/lost
assert.equal(2*(3-2),2*(0-(-1))); // iron/chlorine
assert.equal(4-0,2*(0-(-2))); // sulfur species
// Topic 4.8: match conjugates by exactly one H+ and the corresponding charge.
const conjugates=(acid,acidCharge,base,baseCharge)=>balanced([[1,base,baseCharge],[1,'H',1]],[[1,acid,acidCharge]]);
assert.ok(conjugates('HF',0,'F',-1));
assert.ok(conjugates('H3O',1,'H2O',0));
assert.ok(conjugates('H2CO3',0,'HCO3',-1));
assert.ok(conjugates('HCO3',-1,'CO3',-2));
assert.ok(conjugates('H2O',0,'OH',-1));
assert.ok(conjugates('C2H5NH3',1,'C2H5NH2',0));
assert.ok(conjugates('HSO4',-1,'SO4',-2));
assert.ok(conjugates('H2PO4',-1,'HPO4',-2));
assert.ok(!conjugates('H3PO4',0,'HPO4',-2));
assert.ok(!conjugates('H2PO4',-2,'HPO4',-2));
assert.ok(conjugates('CH3NH3',1,'CH3NH2',0));
assert.ok(!conjugates('CH3NH3',1,'CH3NH2',-1));
assert.ok(balanced([[1,'CH3COOH'],[1,'CN',-1]],[[1,'CH3COO',-1],[1,'HCN']]));
assert.ok(balanced([[2,'H2O']],[[1,'H3O',1],[1,'OH',-1]]));
// Topic 4.9: acidic/basic half-reactions and canceled net equations.
assert.ok(balanced([[1,'Fe',2]],[[1,'Fe',3],[1,'e',-1]]));
assert.ok(!balanced([[1,'Fe',2],[1,'e',-1]],[[1,'Fe',3]]));
assert.ok(balanced([[1,'Cr2O7',-2],[14,'H',1],[6,'e',-1]],[[2,'Cr',3],[7,'H2O']]));
assert.ok(!balanced([[1,'Cr2O7',-2],[14,'H',1],[3,'e',-1]],[[2,'Cr',3],[7,'H2O']]));
assert.ok(!balanced([[1,'Cr2O7',-2],[7,'H',1],[6,'e',-1]],[[2,'Cr',3],[7,'H2O']]));
assert.ok(balanced([[1,'MnO4',-1],[8,'H',1],[5,'Fe',2]],[[1,'Mn',2],[4,'H2O'],[5,'Fe',3]]));
assert.ok(!balanced([[1,'MnO4',-1],[8,'H',1],[1,'Fe',2]],[[1,'Mn',2],[4,'H2O'],[1,'Fe',3]]));
assert.ok(balanced([[1,'MnO4',-1],[2,'H2O'],[3,'e',-1]],[[1,'MnO2'],[4,'OH',-1]]));
assert.ok(!balanced([[1,'MnO4',-1],[2,'H2O'],[2,'e',-1]],[[1,'MnO2'],[4,'OH',-1]]));
assert.ok(balanced([[1,'Zn'],[1,'Ni',2]],[[1,'Zn',2],[1,'Ni']]));
assert.ok(balanced([[2,'I',-1]],[[1,'I2'],[2,'e',-1]]));
assert.ok(!balanced([[1,'I',-1]],[[1,'I2'],[1,'e',-1]]));
assert.ok(balanced([[1,'NO3',-1],[4,'H',1],[3,'e',-1]],[[1,'NO'],[2,'H2O']]));
assert.ok(!balanced([[1,'NO3',-1],[4,'H',1],[5,'e',-1]],[[1,'NO'],[2,'H2O']]));
assert.ok(balanced([[1,'H2O2'],[2,'H',1],[2,'I',-1]],[[1,'I2'],[2,'H2O']]));
const gcd=(a,b)=>b ? gcd(b,a%b) : a;
const electronLCM=3*2/gcd(3,2);
assert.equal(electronLCM,6); assert.equal(electronLCM/3,2); assert.equal(electronLCM/2,3);
assert.ok(balanced([[2,'Al'],[3,'Cu',2]],[[2,'Al',3],[3,'Cu']]));
assert.ok(balanced([[1,'Cl2'],[2,'e',-1]],[[2,'Cl',-1]]));
assert.ok(balanced([[1,'Cl2'],[4,'OH',-1]],[[2,'ClO',-1],[2,'H2O'],[2,'e',-1]]));
assert.ok(balanced([[1,'Cl2'],[2,'OH',-1]],[[1,'Cl',-1],[1,'ClO',-1],[1,'H2O']]));
assert.ok(balanced([[2,'H2']],[[4,'H',1],[4,'e',-1]]));
assert.ok(balanced([[1,'O2'],[4,'H',1],[4,'e',-1]],[[2,'H2O']]));
assert.ok(balanced([[2,'H2'],[1,'O2']],[[2,'H2O']]));
// Topic 5.1: concentration changes per time and stoichiometric species rates.
close((.800-.680)/40*(4/2),.00600);
close((.500-.320)/30,.00600);
close((.320-.260)/30,.00200);
close(((.500-.320)/30)/((.320-.260)/30),3);
close(5/10,.5); close(8/10,.8);
close(.0060/.0040,1.5);
close(.0200/2*3,.0300); close(.0200/2,.0100);
close((.600/100-.300/100)/20,.000150);
assert.ok(balanced([[2,'N2O5']],[[4,'NO2'],[1,'O2']]));
// Topic 5.2: controlled initial-rate comparisons, dimensions and normalization.
{
  const trials=[[.100,.100,.00200],[.200,.100,.00800],[.200,.200,.0160]];
  const proposedOrders=[[1,1],[1,2],[2,1],[2,2]];
  const fits=proposedOrders.map(([aOrder,bOrder])=>{
    const [a,b,rate]=trials[0], k=rate/(a**aOrder*b**bOrder);
    return trials.every(([x,y,observed])=>Math.abs(k*x**aOrder*y**bOrder-observed)<1e-12);
  });
  assert.deepEqual(fits,[false,false,true,false]);
  close(.180/(.300*.200),3);
  close(3**0*(.5)**2,.25);
  assert.equal(1-3,-2); // M exponent of k for third order
  close(.200/.0500,4); close(4**0,1);
  assert.equal(1+2,3); close(2**1*2**2,8);
  for(const [m,n] of [[2,0],[1,1],[0,2]]) close(2**m*2**n,4);
  close(.0120/60,.000200); close((.0120/60)/.0500,.00400);
  close((.0600/2)/(.200**2),.750);
}
// Topic 5.3: integrated laws, half-lives, and a controlled blank-offset example.
{
  const zeroK=(.800-.500)/60;
  close(zeroK,.00500); close(.800-zeroK*100,.300);
  close((1/.100-1/.200)/50,.100);
  close(.800*.5**(90/30),.100);
  assert.equal(64*.5**3,8); assert.equal(3*8,24);
  close(1/(4+.0250*120),1/7);
  close(Math.log(.300/.0600)/.0400,40.23594781085251);
  close((.800-.400)/20,(.400-.200)/10);
  close(1/(.500*.200),10); close(1/(.500*.400),5);
  const measured=[0,10,20].map(t=>50*.006*Math.exp(-.0200*t)+.100);
  const correctedLog=measured.map(abs=>Math.log((abs-.100)/50));
  close((correctedLog[1]-correctedLog[0])/10,-.0200);
  close((correctedLog[2]-correctedLog[1])/10,-.0200);
  const uncorrectedLog=measured.map(abs=>Math.log(abs));
  assert.ok(Math.abs((uncorrectedLog[1]-uncorrectedLog[0])-(uncorrectedLog[2]-uncorrectedLog[1]))>.001);
}
// Topic 5.4: participant exponents and rate-convention factors.
assert.ok(balanced([[1,'NO'],[1,'O3']],[[1,'NO2'],[1,'O2']]));
assert.ok(balanced([[2,'NO2']],[[1,'N2O4']]));
assert.ok(balanced([[1,'SO2Cl2']],[[1,'SO2'],[1,'Cl2']]));
assert.ok(balanced([[2,'NO'],[2,'H2']],[[1,'N2'],[2,'H2O']]));
assert.equal(2+1,3); // hypothetical 2A+B has three participants
close(4*.5,2);
assert.notEqual(2**1,2**2); // distinguish measured first versus proposed second H2 order
close((2*.01)/.01,2); // A disappears twice per P event
assert.ok(balanced([[1,'CH3Br'],[1,'OH',-1]],[[1,'CH3OH'],[1,'Br',-1]]));
// Topic 5.5: successful-encounter products and qualitative tail inclusions.
close(2e6*.020,4e4); close(3e6*.010,3e4);
assert.ok(2e6*.020>3e6*.010);
close((2*1e6*.040*.25)/(1e6*.040*.25),2);
close(1e7*.040*.25,1e5);
assert.ok(integrate(energy=>energyDensity(energy,1),2,100)>integrate(energy=>energyDensity(energy,1),3,100));
assert.ok(integrate(energy=>energyDensity(energy,2),3,100)>integrate(energy=>energyDensity(energy,1),3,100));
assert.ok(balanced([[1,'CO'],[1,'NO2']],[[1,'CO2'],[1,'NO']]));
// Topic 5.6: vertical energy differences, not Arrhenius calculations.
{
  const profile=(reactants,peak,products)=>[peak-reactants,peak-products,products-reactants];
  assert.deepEqual(profile(20,95,-10),[75,105,-30]);
  assert.deepEqual(profile(-20,30,10),[50,20,30]);
  assert.deepEqual(profile(220,295,190),profile(20,95,-10));
  for(const [reactants,peak,products] of [[20,95,-10],[-20,30,10],[0,30,-70]]) {
    const [forward,reverse,change]=profile(reactants,peak,products);
    close(forward-reverse,change);
  }
  close(30-(-70),100);
  assert.ok(40>30); // inconsistent with a sole highest level30 then descent to40
}
// Topic 5.7: add signed stoichiometric vectors before identifying net roles.
function netSteps(...steps) {
  const total={};
  for(const step of steps) for(const [species,coefficient] of Object.entries(step)) total[species]=(total[species] || 0)+coefficient;
  return Object.fromEntries(Object.entries(total).filter(([,coefficient])=>coefficient!==0));
}
assert.deepEqual(netSteps({NO2:-2,NO3:1,NO:1},{NO3:-1,CO:-1,NO2:1,CO2:1}),{NO2:-1,NO:1,CO:-1,CO2:1});
assert.deepEqual(netSteps({NO:-1,O3:-1,NO2:1,O2:1},{NO2:-1,O:-1,NO:1,O2:1}),{O3:-1,O2:2,O:-1});
assert.deepEqual(netSteps({A:-1,B:-1,I:1},{I:-1,C:-1,P:1}),{A:-1,B:-1,C:-1,P:1});
assert.deepEqual(netSteps({A:-1,K:-1,I:1},{I:-1,B:-1,P:1,K:1}),{A:-1,B:-1,P:1});
assert.deepEqual(netSteps({A:-1,B:-1,I:1},{I:-1,B:-1,P:1}),{A:-1,B:-2,P:1});
assert.deepEqual(netSteps({A:-1,I:2},{I:-2,B:-2,P:2}),{A:-1,B:-2,P:2});
assert.ok(balanced([[2,'NO2']],[[1,'NO3'],[1,'NO']]));
assert.ok(balanced([[1,'NO3'],[1,'CO']],[[1,'NO2'],[1,'CO2']]));
assert.ok(balanced([[1,'O3'],[1,'O']],[[2,'O2']]));
// Topic 5.8: approximate slow-first-step laws and explicit rate conventions.
close(2**2,4); close(2**0,1);
close((.2*.03)/(.1*.03),2); // first-order A with free K fixed
close(2*.003,.006); // two products per event, same event k
close(.00300/(.200*.0500),.300);
close(.00300/(.200**2),.0750);
close(.00300/(.200**2*.0500),1.50);
assert.ok(balanced([[1,'NO'],[1,'Cl2']],[[1,'NOCl2']]));
assert.ok(balanced([[1,'NOCl2'],[1,'NO']],[[2,'NOCl']]));
// Topic 5.9: supplied pre-equilibrium algebra and free/pool concentrations.
{
  const K=4, a=.100, b=.0500, c=.200, k2=.300;
  const intermediate=K*a*b;
  close(intermediate,.0200); close(k2*intermediate*c,.00120);
  const kForward=8, kReverse=2;
  close(kForward*a,kReverse*(kForward/kReverse*a));
  close(k2*(kForward/kReverse*a)*b,(k2*kForward/kReverse)*a*b);
  const kd=.040, dimer=.250;
  close(Math.sqrt(kd*dimer),.100);
  close(Math.sqrt(kd*(4*dimer))/Math.sqrt(kd*dimer),2); // half-order in dimer
  close((K*a*c/(2*b))/(K*a*c/b),.5); // inverse apparent B dependence in its valid regime
  const pool=.300, ratio=2.00;
  const freeA=pool/(1+ratio), freeI=ratio*freeA;
  close(freeA,.100); close(freeI,.200); close(freeA+freeI,pool);
  close(.500*freeI*.100,.0100);
  assert.equal((-1)+(-1)-0,-2); // M powers: k2 k1 / k_reverse
  assert.ok(balanced([[2,'NO']],[[1,'N2O2']]));
  assert.ok(balanced([[1,'N2O2'],[1,'O2']],[[2,'NO2']]));
}
// Topic 5.10: interleaved minimum/maximum levels, local direction and endpoints.
{
  const forwardBarriers=levels=>levels.filter((_,i)=>i%2===1).map((peak,i)=>peak-levels[2*i]);
  const reverseBarriers=levels=>levels.filter((_,i)=>i%2===1).map((peak,i)=>peak-levels[2*i+2]).reverse();
  assert.deepEqual(forwardBarriers([10,70,-20,40,0]),[60,60]);
  assert.deepEqual(forwardBarriers([5,45,15,75,25,55,-5]),[40,60,30]);
  assert.deepEqual(reverseBarriers([5,45,15,75,25,55,-5]),[60,50,30]);
  close(25+(-60),-35);
  assert.deepEqual(reverseBarriers([0,40,-20,30,-50]),[80,60]);
  assert.deepEqual(forwardBarriers([0,60,20,90,-10]),[60,70]);
  assert.deepEqual(forwardBarriers([0,60,10,90,-10]),[60,80]);
  const intermediate=0-10, secondPeak=intermediate+30, product=intermediate+20;
  assert.deepEqual([0+50,intermediate,secondPeak,product],[50,-10,20,10]);
  assert.ok(40>30); // proposed intermediate above its preceding claimed maximum
  assert.deepEqual(forwardBarriers([0,45,5,40,-30]),[45,35]);
}
// Topic 5.11: catalyst/site conservation across a completed cycle.
close(10.0-6.00,4.00); // micromolar free enzyme from total minus complex
assert.deepEqual(netSteps({H2O2:-1,I:-1,H2O:1,IO:1},{H2O2:-1,IO:-1,H2O:1,O2:1,I:1}),{H2O2:-2,H2O:2,O2:1});
assert.ok(balanced([[1,'H2O2'],[1,'I',-1]],[[1,'H2O'],[1,'IO',-1]]));
assert.ok(balanced([[1,'H2O2'],[1,'IO',-1]],[[1,'H2O'],[1,'O2'],[1,'I',-1]]));
assert.deepEqual(netSteps({S:-1,H:-1,SH:1},{SH:-1,H2O:-1,P:1,H:1}),{S:-1,H2O:-1,P:1});
assert.deepEqual(netSteps({A:-1,'*':-1,'A*':1},{B:-1,'*':-1,'B*':1},{'A*':-1,'B*':-1,P:1,'*':2}),{A:-1,B:-1,P:1});
assert.deepEqual(netSteps({S:-1,Q:-1,SQ:1},{SQ:-1,P:1}),{S:-1,Q:-1,P:1});
close(0-(-20),20); close(0-(-100),100);
// Topic 6.2: signed endpoint gaps and explicit total-batch scaling.
close(50-18,32);
close(-10-(-40),30);
close(2*(-12),-24);
close((-75)+75,0);
close(0-20,-20);
close(40-(-20),60); close(3*20,60);
// Topic 6.4: q=mcΔT, molar/total capacity, and calorimeter conservation.
close(50.0*4.184*(32.0-20.0),2510.4);
close(30.0*.385*(25.0-90.0),-750.75);
close(540/(.250*24.0),90);
close(225/(15.0*20.0),.750);
close(-(100*4.00+50.0)*5.00,-2250);
const mixedWaterTemperature=(200*80+100*20)/(200+100);
close(mixedWaterTemperature,60);
close(200*4.184*(mixedWaterTemperature-80)+100*4.184*(mixedWaterTemperature-20),0);
close(.800/.400,2);
close(-120*4.184*(-3.50),1757.28);
close(1200/(16-10),200);
close(90.0/60.0,1.50); close(10.0*(90/60)*4,60);
close((10.0/60.0)*90.0*4,60);
// Topic 6.5: separate latent and sensible heat terms with consistent kJ units.
close(2.00*6.01,12.02);
close(-(36.0/18.0)*40.7,-81.4);
close(20.0/25.0,.800);
close((10/18)*6.01+10*4.184*20/1000,4.175688888888889);
close(3.00/6.00,.500); close(1.00-3.00/6.00,.500);
close(.250*(-8.00),-2);
close(100*300/1000/.750,40);
close((10/20)*30,15); close((10/40)*30,7.50);
close(-40.7+18*4.184*(25-100)/1000,-46.3484);
close(.500*6.00+.500*(-6.00),0);
// Topic 6.6: reaction-as-written extents and explicit per-species bases.
close(.500/2*(-572),-143);
close(.300/2*(-92.0),-13.8);
close(10.0/100.0*178,17.8);
close(45.0/90.0,.500);
close(Math.min(.300/2,.300/3)*(-1400),-140);
close(-1.25/.0250,-50.0);
close(.100*56.0*1000/(100*4),14.0);
close(-286-(-242),-44);
close(.400*.600/2*(-100),-12.0);
close(-80/2,-40);
assert.ok(balanced([[2,'H2'],[1,'O2']],[[2,'H2O']]));
assert.ok(balanced([[1,'N2'],[3,'H2']],[[2,'NH3']]));
// Topic 6.7: separately counted bonds, broken minus formed (gas phase).
close(436+243-2*431,-183);
close(945+3*436-6*391,-93);
close(413+243-328-431,-103);
close(4*413+243-(3*413+328+431),-103);
close(614+436-347-2*413,-123);
close((2*436+498+484)/4,463.5);
close(-484+2*(-44),-572);
close(.200*193,38.6);
close(4*413+2*498-(2*799+4*463),-802);
close(4*413+2*498-(799+4*463),-3); // missed CO2 bond distractor
assert.ok(balanced([[1,'CH4'],[1,'Cl2']],[[1,'CH3Cl'],[1,'HCl']]));
assert.ok(balanced([[1,'C2H4'],[1,'H2']],[[1,'C2H6']]));
assert.ok(balanced([[1,'CH4'],[2,'O2']],[[1,'CO2'],[2,'H2O']]));
// Topic 6.8: coefficient-weighted formation sums, including wrong-option arithmetic.
close(-393.5-(-110.5),-283.0);
close(-393.5+2*(-285.8)-(-74.8),-890.3);
close(-635.1+(-393.5)-(-1206.9),178.3);
close(-285.8-(-241.8),-44);
close(3*(-393.5)-(-824.2+3*(-110.5)),-24.8);
close(-393.5-(-824.2+3*(-110.5)),762.2);
close(3*(-393.5)-3*(-110.5),-849);
close(-92.2/2,-46.1);
close((-393.5+2*(-285.8)-(-238.7))*.500,-363.2);
close((-393.5+2*(-285.8)+(-238.7))*.500,-601.9);
close(2*33.2-2*90.3,-114.2);
close(-100-(-300),200);
console.log('Implemented numerical and scientific-model checks passed. See per-topic QA for coverage, qualitative review, and human-review limits.');
