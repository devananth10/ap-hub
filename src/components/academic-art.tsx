"use client";

import { useId } from "react";
import type { AcademicTheme } from "@/lib/artwork";

/** Original, decorative SVG artwork. All themes share one fixed-size frame. */
export function AcademicArt({ theme, compact = false }: { theme: AcademicTheme; compact?: boolean }) {
  const id = useId().replaceAll(":", "");
  const core = `${id}-core`;
  const halo = `${id}-halo`;
  const dot = (x: number, y: number, r = 4, color = "#b9d7b6") => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={color} stroke="none" />;
  const glow = (x: number, y: number, r = 17) => <g><circle cx={x} cy={y} r={r * 2.3} fill={`url(#${halo})`} stroke="none" /><circle cx={x} cy={y} r={r} fill={`url(#${core})`} stroke="none" /></g>;
  return (
    <svg className={`academic-art orbit-art${compact ? " compact" : ""}`} data-art-theme={theme} viewBox="0 0 380 280" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={core} cx="35%" cy="30%"><stop stopColor="#d8f3cd" /><stop offset="1" stopColor="#72b9a4" /></radialGradient>
        <radialGradient id={halo}><stop stopColor="#9bdac1" stopOpacity=".2" /><stop offset="1" stopColor="#9bdac1" stopOpacity="0" /></radialGradient>
      </defs>
      <g stroke="#acd1bc" strokeWidth="1" strokeOpacity=".15"><path d="M30 140H350M190 24V256" strokeDasharray="2 7" /><circle cx="190" cy="140" r="105" /></g>
      <g stroke="#bed7bd" strokeWidth="1.2" strokeOpacity=".5" strokeLinecap="round" strokeLinejoin="round">
        {theme === "chemistry" && <>
          <ellipse cx="224" cy="129" rx="98" ry="38" transform="rotate(-42 224 129)" /><ellipse cx="224" cy="129" rx="98" ry="38" transform="rotate(42 224 129)" /><ellipse cx="224" cy="129" rx="98" ry="38" transform="rotate(90 224 129)" />
          <path d="m64 178 30-46 54 10 23 48-31 37-54-7Z M94 132l-8-41m62 51 36-29M86 220l-29 19" />
          {glow(224,129,22)}{dot(94,132,7)}{dot(171,190,6)}{dot(64,178,5)}{dot(86,91,5,"#dfbda0")}{dot(297,84,6,"#dfbda0")}{dot(224,227,6)}
          <path d="M273 222h30m-15-15v30" strokeOpacity=".2" />
        </>}
        {theme === "biology" && <>
          <path d="M135 35C285 75 95 202 245 245M245 35C95 75 285 202 135 245" />
          {[49,72,95,118,141,164,187,210,233].map((y,i) => { const spread=Math.cos((y-35)/210*Math.PI*2)*48; return <g key={y}><path d={`M${190-spread} ${y}H${190+spread}`} strokeOpacity=".55" />{dot(190-spread,y,3,i%2 ? "#dfbda0" : "#b9d7b6")}{dot(190+spread,y,3)}</g>; })}
          <circle cx="73" cy="152" r="29" /><ellipse cx="73" cy="152" rx="23" ry="27" strokeDasharray="3 6" />{glow(73,152,10)}
          <circle cx="306" cy="107" r="25" />{glow(306,107,8)}<path d="m281 107-25 9M94 130l32-18" strokeDasharray="3 5" />
        </>}
        {theme === "calculus" && <>
          <path d="M56 224H335m-10-6 10 6-10 6M76 242V34m-6 10 6-10 6 10" />
          <path d="M78 192C123 192 129 64 181 69S230 237 275 186s28-83 49-106" strokeWidth="1.7" />
          <path d="m152 197 140-88" stroke="#dfbda0" /><path d="M229 149v75M76 149h153" strokeDasharray="3 6" strokeOpacity=".3" />
          <path d="M96 224v-36m13 36v-49m13 49v-73m13 73v-103m13 103v-128m13 128v-146" strokeOpacity=".16" />
          {glow(229,149,9)}{dot(181,69,5)}{dot(275,186,4)}
          <text x="283" y="62" fill="#b8d7c1" stroke="none" opacity=".7" fontSize="17" fontFamily="Georgia,serif">ƒ(x)</text>
          <text x="290" y="246" fill="#b8d7c1" stroke="none" opacity=".55" fontSize="10">x</text>
        </>}
        {theme === "physics" && <>
          <ellipse cx="205" cy="120" rx="116" ry="64" transform="rotate(-21 205 120)" /><ellipse cx="205" cy="120" rx="76" ry="39" transform="rotate(-21 205 120)" />
          {glow(205,120,22)}{dot(306,71,9,"#dfbda0")}{dot(138,147,5)}<path d="m301 58 18 1-5 17" />
          <path d="M42 221c20-42 33-42 53 0s33 42 53 0 33-42 53 0 33 42 53 0 33-42 53 0 33 42 40 19" strokeOpacity=".55" /><path d="M35 221h314" strokeDasharray="3 7" strokeOpacity=".22" />
          <path d="m48 86 42-16-12 24M48 86l25 5" strokeOpacity=".6" />
        </>}
        {theme === "computer-science" && <>
          <rect x="147" y="95" width="89" height="89" rx="12" /><rect x="159" y="107" width="65" height="65" rx="6" strokeOpacity=".3" />
          <path d="m180 126-13 13 13 13m23-26 13 13-13 13m0-27-14 29" />
          <path d="M147 116H91V69H55m92 94H71v52H40M171 95V49h39M212 95V29M236 116h46V64h40M236 162h73v53h34M170 184v46h-40m82-46v61" />
          {[ [55,69],[40,215],[210,49],[212,29],[322,64],[343,215],[130,230],[212,245] ].map(([x,y],i)=>dot(x,y,5,i%3 ? "#b9d7b6" : "#dfbda0"))}
          {glow(191,139,11)}
        </>}
        {theme === "history" && <>
          <circle cx="225" cy="113" r="69" /><ellipse cx="225" cy="113" rx="30" ry="69" /><path d="M156 113h138m-129-33c35 13 83 13 120 0m-120 66c35-13 83-13 120 0" />
          <path d="m179 68 38 25 50-22m-91 78 44-22 51 27m-54-61 3 34 47-56" strokeDasharray="3 5" strokeOpacity=".6" />{dot(179,68,4)}{glow(217,93,9)}{dot(220,127,4)}{dot(271,154,5,"#dfbda0")}
          <path d="M42 220h294M76 209v22m70-22v22m70-22v22m70-22v22M76 207V156h42V99h35" strokeOpacity=".45" />
          {dot(76,220,6)}{dot(146,220,4)}{dot(216,220,6,"#dfbda0")}{dot(286,220,4)}<path d="m62 187 14-13 14 13M66 188v12h20v-12" />
        </>}
        {theme === "geography" && <>
          <path d="m48 66 80-22 72 22 69-22 63 22v157l-63-22-69 22-72-22-80 22Z M128 44v157m72-135v157m69-179v157" strokeOpacity=".35" />
          <path d="m66 94 50-17 33 25 44-5 37 31 58-40 26 21m-248 63 48-13 45 18 55-20 33 23 67-30M88 206l26-47 35-57 65 55 74-69" />
          {glow(149,102,10)}{dot(114,159,6)}{dot(214,157,8,"#dfbda0")}{dot(288,88,5)}
          {[ [101,102],[91,118],[125,126],[169,122],[178,148],[239,127],[253,145],[285,165],[289,130],[80,180] ].map(([x,y])=>dot(x,y,2))}
          <circle cx="307" cy="228" r="18" /><path d="m307 214 6 14-6 14-6-14Z" strokeOpacity=".6" />
        </>}
        {theme === "literature" && <>
          <path d="M190 95c-35-27-75-32-125-17v137c50-15 90-10 125 17 35-27 75-32 125-17V78c-50-15-90-10-125 17Z M190 95v137" />
          <path d="M85 104c33-8 59-3 84 11m-84 14c33-8 59-3 84 11m-84 14c33-8 59-3 84 11m42-50c25-14 51-19 84-11m-84 36c25-14 51-19 84-11m-84 36c25-14 51-19 84-11" strokeOpacity=".28" />
          <path d="m104 51 49-22 78 14 53-15m-180 23 52 23 75-31" strokeDasharray="3 6" />{dot(104,51,4)}{dot(153,29,5,"#dfbda0")}{glow(231,43,9)}{dot(284,28,4)}
        </>}
      </g>
      <g stroke="#b9d7b6" strokeOpacity=".45" strokeWidth="1"><path d="M32 43v10m-5-5h10M342 177v10m-5-5h10M329 35v6m-3-3h6" /></g>
    </svg>
  );
}
