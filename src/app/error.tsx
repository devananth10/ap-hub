"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="page empty-state"><h1>Let’s give that another try.</h1><p>The page couldn’t load. Your saved notes stay in your browser.</p><button className="button primary" onClick={reset}>Try again</button></div>; }
