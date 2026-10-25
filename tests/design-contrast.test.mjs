import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Check the actual shipped palettes, not a copied test palette. This prevents
// future cosmetic adjustments from quietly reducing text/control contrast.
const css = readFileSync(new URL('../src/app/design-system.css', import.meta.url), 'utf8');
const tokens = block => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map(([,name,value]) => [name,value]));
const light = tokens(css.match(/:root\s*\{([^}]+)\}/s)[1]);
const dark = tokens(css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/s)[1]);
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
}
function contrast(a,b) {
  const values = [luminance(a),luminance(b)].sort((a,b)=>b-a);
  return (values[0]+.05)/(values[1]+.05);
}
function meets(palette, foreground, background, minimum) {
  assert.ok(palette[foreground] && palette[background], `Missing tokens: ${foreground}, ${background}`);
  const ratio = contrast(palette[foreground],palette[background]);
  assert.ok(ratio >= minimum, `${foreground} on ${background}: ${ratio.toFixed(2)}:1, expected ${minimum}:1`);
}
for (const [theme,palette] of [['light',light],['dark',dark]]) {
  test(`${theme} reading text and brand actions meet normal-text contrast`,()=>{
    for (const background of ['--bg','--surface','--surface-alt','--teal-light']) {
      for (const foreground of ['--ink','--muted','--teal']) meets(palette,foreground,background,4.5);
    }
    meets(palette,'--on-brand','--teal',4.5);
    meets(palette,'--hero-ink','--hero',4.5);
    meets(palette,'--hero-muted','--hero',4.5);
    meets(palette,'--danger-ink','--danger-bg',4.5);
    meets(palette,'--ink','--danger-bg',4.5);
  });
  test(`${theme} essential control boundaries and focus rings meet non-text contrast`,()=>{
    for(const background of ['--bg','--surface']) {
      meets(palette,'--control-border',background,3);
      meets(palette,'--focus-ring',background,3);
    }
  });
  test(`${theme} course category labels remain readable on their subject surfaces`,()=>{
    for(const subject of ['teal','violet','peach','blue','rose','amber']) {
      const selector = theme==='dark' ? `\\[data-theme="dark"\\] \\.${subject}` : `^\\.${subject}`;
      const block = css.match(new RegExp(`${selector} \\{([^}]+)\\}`,'m'));
      assert.ok(block, `Missing ${theme}/${subject} palette`);
      meets(tokens(block[1]),'--course-fg','--course-bg',4.5);
    }
  });
}
