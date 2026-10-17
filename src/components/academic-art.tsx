"use client";

import type { AcademicTheme } from "@/lib/artwork";

/** Original, decorative SVG artwork. All themes share one fixed-size frame. */
export function AcademicArt({ theme, compact = false }: { theme: AcademicTheme; compact?: boolean }) {
  const dot = (x: number, y: number, r = 4) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#9cbbaa" stroke="none" />;
  const center = (x: number, y: number, r = 14) => <circle cx={x} cy={y} r={r} />;
  return (
    <svg className={`academic-art orbit-art${compact ? " compact" : ""}`} data-art-theme={theme} viewBox="0 0 380 280" fill="none" aria-hidden="true" focusable="false">
      <g stroke="#9cbbaa" strokeWidth="1.3" opacity=".65" strokeLinecap="round" strokeLinejoin="round">
        {theme === "chemistry" && <>
          <ellipse cx="224" cy="129" rx="92" ry="35" transform="rotate(-42 224 129)" /><ellipse cx="224" cy="129" rx="92" ry="35" transform="rotate(42 224 129)" /><ellipse cx="224" cy="129" rx="92" ry="35" transform="rotate(90 224 129)" />
          <path d="m65 172 28-43 47 10 24 45-30 35-47-7Z M140 139l32-24" opacity=".55" />
          {center(224,129)}{dot(93,129)}{dot(164,184)}{dot(293,86)}{dot(224,221)}
        </>}
        {theme === "biology" && <>
          <path d="M135 35C285 75 95 202 245 245M245 35C95 75 285 202 135 245" />
          {[62,92,122,152,182,212].map((y) => { const spread=Math.cos((y-35)/210*Math.PI*2)*48; return <path key={y} d={`M${190-spread} ${y}H${190+spread}`} opacity=".65" />; })}
          <circle cx="79" cy="153" r="27" />{center(79,153,7)}<path d="m104 143 28-18" opacity=".45" />
        </>}
        {theme === "calculus" && <>
          <path d="M56 224H335m-10-6 10 6-10 6M76 242V34m-6 10 6-10 6 10" />
          <path d="M78 192C123 192 129 64 181 69S230 237 275 186s28-83 49-106" strokeWidth="1.7" />
          <path d="m152 197 140-88" opacity=".5" />
          {dot(229,149,5)}{dot(181,69)}{dot(275,186)}
          <text x="283" y="62" fill="#9cbbaa" stroke="none" fontSize="17" fontFamily="Georgia,serif">ƒ(x)</text>
        </>}
        {theme === "physics" && <>
          <ellipse cx="205" cy="120" rx="116" ry="64" transform="rotate(-21 205 120)" /><ellipse cx="205" cy="120" rx="76" ry="39" transform="rotate(-21 205 120)" />
          {center(205,120,16)}{dot(306,71,6)}{dot(138,147)}
          <path d="M52 221c20-36 33-36 53 0s33 36 53 0 33-36 53 0 33 36 53 0 33-36 53 0" opacity=".5" />
        </>}
        {theme === "computer-science" && <>
          <rect x="147" y="95" width="89" height="89" rx="9" />
          <path d="m180 126-13 13 13 13m23-26 13 13-13 13m0-27-14 29" />
          <path d="M147 116H91V69H55M171 95V49h39M236 116h46V64h40M236 162h73v53h34M170 184v46h-40" opacity=".7" />
          {[ [55,69],[210,49],[322,64],[343,215],[130,230] ].map(([x,y])=>dot(x,y))}
        </>}
        {theme === "history" && <>
          <circle cx="225" cy="113" r="69" /><ellipse cx="225" cy="113" rx="30" ry="69" /><path d="M156 113h138m-129-33c35 13 83 13 120 0m-120 66c35-13 83-13 120 0" />
          {dot(179,68)}{dot(271,154)}
          <path d="M58 220h263M76 212v16m70-16v16m70-16v16m70-16v16" opacity=".65" />
          {dot(76,220)}{dot(216,220)}
        </>}
        {theme === "geography" && <>
          <path d="m48 66 80-22 72 22 69-22 63 22v157l-63-22-69 22-72-22-80 22Z M128 44v157m72-135v157m69-179v157" strokeOpacity=".35" />
          <path d="m88 191 41-42 38-49 53 52 68-64" />
          {dot(88,191)}{dot(129,149)}{dot(167,100,5)}{dot(220,152)}{dot(288,88)}
        </>}
        {theme === "literature" && <>
          <path d="M190 95c-35-27-75-32-125-17v137c50-15 90-10 125 17 35-27 75-32 125-17V78c-50-15-90-10-125 17Z M190 95v137" />
          <path d="M85 116c33-8 59-3 84 11m-84 22c33-8 59-3 84 11m42-33c25-14 51-19 84-11m-84 44c25-14 51-19 84-11" opacity=".45" />
          <path d="m126 44 64-15 64 15" opacity=".55" />{dot(126,44)}{dot(190,29)}{dot(254,44)}
        </>}
      </g>
    </svg>
  );
}
