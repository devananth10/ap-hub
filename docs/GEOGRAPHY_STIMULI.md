# Original geography stimuli and question publication

Question bank: `src/content/practice/human-geography-u-t.json`, unchanged five-field question schema. Stable IDs: `hug-u-t-001` through `011`. Metadata, skill/difficulty and independent review: `content-drafts/human-geography/qa/topic-u-t.json`. Explicit published registry: `src/lib/human-geography-bank.ts`; the shared Practice registry and lightweight count index include it. Saving an unregistered file alone never publishes it.

## Local stimulus schema

`src/content/practice-stimuli/human-geography.json` maps stable question IDs to the typed union in `src/lib/geography-stimuli.ts`. The shared `GeographyStimulus` renders only the current question; it leaves existing Calculus graph/table components unchanged. All current assets are original SVG schematics/synthetic data with explicit hypothetical captions and attribution. No external images, media, geographic services or new dependency are needed at question time.

Common fields: `title`, `description` (equivalent accessible evidence, not a hidden answer), `caption`, `hypothetical: true`, and `attribution: "Original PrepAtlas schematic and synthetic data"`.

- `map`: `mapType` is choropleth, dot, reference, flow, isoline or proportional. Regions contain unique labels and polygon coordinates in the x=0–100, y=0–60 north-up schematic plane. Optional dots/points and labeled paths supply positions, values and explicit flow-arrow direction. Choropleths require contiguous nonoverlapping `[min,max)` bins, and every mapped value must fit. Values are printed so color is not the only evidence. `unitLabel` is mandatory. A uniform `kmPerUnit`, if provided, defines the 20-unit scale bar; otherwise the figure says not to scale. Proportional circle radii use square roots of values, normalized to a maximum radius of 20. Never assert real-country geometry from these fictional regions.
- `chart`: categories, one to three labeled numeric series, units and a positive maximum. Bar heights start at zero and encode `value/max`. Printed values, lettered series and a full equivalent data table avoid reliance on color. Negative values are not supported by this first renderer.
- `pyramid`: cohorts listed youngest to oldest with contiguous integer `ageStart`/`ageEnd` bounds; only the last may have open-ended `ageEnd: null`. Male/female values are nonnegative and share a common maximum/scale. Rendering reverses rows so oldest is at the top and uses equal scale lengths on both sides. Full data table included. Review denominators, units, sums and inferences explicitly in each question's QA; shape alone does not establish an exact demographic stage, birth rate or life expectancy.
- `model`: uniquely labeled positioned nodes, directed edges with actual meanings and explicit assumptions. Optional labeled concentric rings must be within the stated schematic bounds. A generic node/ring renderer is not certification of every geographic model: check the specific model, order, assumptions and limitations before using it.
- `table`: nonempty headers and complete string rows with column/row headers. All totals, rates, units and interpretations still require question-specific QA.

All stimuli include readable text/equivalent data, local legends, theme-aware contrast and no color-only essential distinction. Responsive SVGs fit the page. Enlarge opens a focused modal initially fitted to the screen; a keyboard-accessible 100–200% slider permits controlled horizontal panning inside the modal. Closing restores focus. The control sits outside the disabled answer fieldset, so it still works during graded-answer review. Enlarging never changes selections, score or question position.

## Validation and limitations

Run `pnpm test:geography-bank` for all present sets/QA/visuals and `pnpm test:unit` for renderer/evidence mutations. Numeric tests corroborate actual SVG geometry: legend bins, plotted dot counts, bar heights, symmetric pyramid bars/age order, proportional area and flow endpoints. The first topic adds separate recomputation of district-density comparisons, dot counts, contour gradients, scaled distance/direction and circle-area ratios. Correct-option/hash checks detect stale content; they do not prove conceptual accuracy. Reasoning questions require separate documented review of all four options, ambiguity, scope and originality. No independent human review is claimed.

After checks pass, `node --experimental-strip-types scripts/publish-human-geography-topics.mjs` explicitly registers the present complete topics, preserves other courses' index entries and updates actual progress. Run all appropriate application/HTTP/browser checks and save a verified GitHub checkpoint. Do not publish a known broken map/question. Keep unfinished topics empty. Future visual types and real-world licensed assets require their own source/rights and rendering validation.

## Topic 1.1 checkpoint observations

Eleven original MCQs; four meaningful map stimuli (36.36%): choropleth, dot distribution, isolines and reference/scale. Five programmatic data/geometry checks, six documented reasoning reviews; all four answer positions and all five skills represented. No photos, actual-country statistics or external asset licenses needed.

Browser checks covered all eleven questions, correct/incorrect feedback, retry, retained navigation and the expected **10/11** first-attempt score after one deliberate wrong answer followed by a correct retry. Enlargement still worked after grading. Mobile 390×844 map labels, legend, scale and 100/200% zoom were inspected. An oversized modal-close icon and cramped contour labels were found and corrected before this checkpoint. All four map types rendered; chart/pyramid/model/table components were checked through synthetic unit fixtures, not yet published questions. No claim that later units or all 748 questions are complete.

## Topic 1.2 checkpoint

Eleven additional original Geographic Data questions are published (22 total across two topics). Four new stimuli: two native tables, one lettered grouped-bar chart with equivalent data, and a cloud-free-image coverage map. Total meaningful stimulus count is eight (36.36%): five maps, one chart and two tables. Seven numerical/geometry models corroborate present sets; all other items have individual reasoning records. Participation rates independently recompute to 60%, 60%, 10%; regional image coverage compares 87.5% north and 12.5% south without claiming land-cover values.

All eleven Topic 1.2 questions were graded in a browser and produced 11/11. Mobile 390×844 chart/table enlargement, all series/category labels and data were inspected. Light/dark chart contrast and review-time enlargement passed. The lesson page now exposes Start Practice for the correct eleven-question set while keeping its chosen video mounted; instructor/note/watched persistence was unchanged. A cramped first table column was corrected. TypeScript/build and 125 unit tests passed at this milestone; all 68 Geography topic/Practice routes and standard application smoke checks were rerun. Later topics remain incomplete.

## Topic 1.3 checkpoint

Eleven new questions bring the bank to 33 across three topics, with twelve stimuli (36.36%): six maps, two charts and four tables. Eleven explicit data/geometry checks now corroborate the bank. Topic 1.3 covers decision-making and evidentiary limits: budget-constrained clinic siting, school/floodplain screening, absolute versus relative population change and observational policy comparison. A tied eligible-site count is rejected by the checker even with a refreshed evidence hash. All answer positions are varied; each option has an explanation and each question has a separate reasoning record.

All eleven Topic 1.3 questions were exercised in the browser with the expected 11/11 result. Mobile 390×844 map/chart/table enlargement was inspected; school labels now support explicit alignment to avoid crossing mapped regions. Both temperature changes equal −3°C, without claiming a proven causal effect. No new visual type or external asset was added. All 126 unit tests, TypeScript and production build passed; later topics are unfinished.

## Topics 1.4–1.5 checkpoint

55 MCQs across five topics; twenty stimulus questions (36.36%): eight maps, four charts and eight tables. Nineteen explicit data/geometry checks corroborate present sets. The spatial-concept checks recompute alignment, reversed distance/time ordering, distance-decay shares and positive association. Environmental checks recompute aquifer balance (−40 million m³/year proposed), exhaustive fixed-area land-cover totals and changes (−30,+10,+20 km²), river direction, and the same-setting/different-response comparison. They do not convert association into causation or infer an aquifer exhaustion date without a starting stock.

Each new topic was exercised through all eleven answers and a correct 11/11 browser result. Mobile 390×844 travel-time/farming tables, land-cover/distance-decay bars and river map were inspected. The river arrow was initially faint on a pale map region; shaded-map paths now use a dark line and arrowhead with a light outline, and high-contrast labels. Existing unshaded isolines retain their theme-aware style. All 128 automated tests, TypeScript and build passed. Later topics remain unfinished.
