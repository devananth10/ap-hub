import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

// Check the actual shipped palettes, not a copied test palette. This prevents
// future cosmetic adjustments from quietly reducing text/control contrast.
const css = readFileSync(new URL('../src/app/design-system.css', import.meta.url), 'utf8');
const baseCSS = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');
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
    // Category text uses its own historic ink color, independently of the
    // decorative subject icon color. Test the actual label foreground.
    const categoryInk = css.match(/\.subject-category\s*\{[^}]*color:\s*(#[\da-f]{6})/i)?.[1];
    assert.ok(categoryInk, 'Missing category text color');
    for(const subject of ['teal','violet','peach','blue','rose','amber']) {
      const selector = theme==='dark' ? `\\[data-theme="dark"\\] \\.${subject}` : `^\\.${subject}`;
      const block = css.match(new RegExp(`${selector} \\{([^}]+)\\}`,'m'))
        || baseCSS.match(new RegExp(`(?:^|\\})\\s*\\.${subject} \\{([^}]+)\\}`));
      assert.ok(block, `Missing ${theme}/${subject} palette`);
      meets({...tokens(block[1]), '--category-ink':categoryInk},'--category-ink','--course-bg',4.5);
    }
  });
}

test('the approved original palette is retained with only the light muted-ink contrast correction',()=>{
  // Verified against the archived October 21 image at digest 70e9e5fb...393261
  // and its matching Git source f622e3a, rather than the later green redesign.
  // The owner authorized only the two-step light muted-ink correction for release.
  const original = {
    light:{'--bg':'#f7f8fa','--surface':'#ffffff','--surface-alt':'#f5f7f7','--ink':'#243336','--muted':'#657177','--border':'#e6eaeb','--teal':'#267668','--teal-light':'#edf5f1','--hero':'#174b43'},
    dark:{'--bg':'#101b1d','--surface':'#192629','--surface-alt':'#1e2d30','--ink':'#e3eeeb','--muted':'#a2b3b3','--border':'#304044','--teal':'#87cbb6','--teal-light':'#263f39','--hero':'#163e38'},
  };
  for(const [theme,palette] of [['light',light],['dark',dark]]) {
    for(const [name,value] of Object.entries(original[theme])) assert.equal(palette[name],value,`${theme}/${name}`);
  }
  assert.match(css,/\.hero-button\s*\{[^}]*background:\s*#e8edda/);
  assert.match(css,/\.topbar\s*\{[^}]*background:\s*var\(--surface\)/);
  assert.match(css,/\.practice-focus\s*\{[^}]*background:\s*var\(--hero\)/);
});
