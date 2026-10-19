// One-time source/metadata audit only. Does not publish or import resources.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const root = 'content-drafts/chemistry/research';
const candidates = JSON.parse(readFileSync(`${root}/video-candidates.json`, 'utf8'));
const source = 'https://jeremykrug.com/ap-chem-videos/';
const checkedOn = new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const response = await fetch(source, { signal: AbortSignal.timeout(20000) });
if (!response.ok) throw new Error(`Directory unavailable: ${response.status}`);
const html = await response.text();
mkdirSync('tmp', { recursive: true });
writeFileSync('tmp/krug-directory-current.html', html);
const anchors = [...html.matchAll(/<a\b[^>]*href=["'](https:\/\/youtu\.be\/[A-Za-z0-9_-]{11})[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)].map(match => ({
  url: match[1], title: match[2].replace(/<[^>]*>/g, '').trim(),
  before: html.slice(Math.max(0, match.index - 250), match.index).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim(),
}));
const records = [];
const unique = [...new Set(candidates.videos.map(video => video.url))];
let cursor = 0;
await Promise.all(Array.from({ length: 2 }, async () => {
  while (cursor < unique.length) {
    const url = unique[cursor++];
    const entries = candidates.videos.filter(video => video.url === url);
    const directoryMatches = entries.map(entry => ({ sourceLabel: entry.sourceLabel, found: anchors.some(anchor => anchor.url === url && anchor.before.endsWith(`${entry.sourceLabel} –`)), officialTopics: entry.officialTopics }));
    const record = { url, videoId: new URL(url).pathname.slice(1), directoryMatches, checkedOn, metadataVerified: false, creatorMatched: false, playbackVerified: false, embedPermissionCertified: false };
    try {
      const cached = process.argv.includes('--reuse-metadata') ? JSON.parse(readFileSync(`${root}/KRUG_VERIFICATION.json`, 'utf8')).records.find(item => item.url === url && item.checkedOn === record.checkedOn && item.metadataVerified && item.creatorMatched) : null;
      const metadata = cached ? {status:200, ok:true, json:async()=>({title:cached.title, author_name:cached.creator, author_url:cached.creatorUrl})} : await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { signal: AbortSignal.timeout(15000) });
      record.status = metadata.status;
      if (metadata.ok) {
        const data = await metadata.json();
        record.title = data.title; record.creator = data.author_name; record.creatorUrl = data.author_url;
        record.metadataVerified = typeof data.title === 'string' && !!data.title.trim();
        record.creatorMatched = /Jeremy Krug/i.test(data.author_name || '') && data.author_url === entries[0].providerAuthorUrl;
        // Older research has no per-entry author URL for the first lookup pass.
        if (!entries[0].providerAuthorUrl) record.creatorMatched = /Jeremy Krug/i.test(data.author_name || '') && /^https:\/\/www.youtube.com\//.test(data.author_url || '');
      }
    } catch (error) { record.error = error.name; }
    record.eligible = record.metadataVerified && record.creatorMatched && directoryMatches.every(item => item.found);
    records.push(record);
    if (records.length % 20 === 0) console.log(`Verified ${records.length}/${unique.length}`);
    if (record.status === 429) throw new Error('Provider rate limit: stop verification, preserve prior research.');
  }
}));
records.sort((a,b) => unique.indexOf(a.url) - unique.indexOf(b.url));
const report = { source, checkedOn, directoryEntryCount: anchors.length, researchedEntries: candidates.videos.length, uniqueVideoIds: unique.length, verifiedUniqueVideos: records.filter(item => item.eligible).length, verificationLevel: 'Current creator directory labels/URLs and public YouTube oEmbed titles/creator; no full viewing, transcript review or universal playback/embed certification.', records };
writeFileSync(`${root}/KRUG_VERIFICATION.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ directoryEntries: anchors.length, researchedEntries: candidates.videos.length, unique: unique.length, verified: report.verifiedUniqueVideos, unmatched: records.filter(item => !item.eligible).map(item => ({id:item.videoId, matches:item.directoryMatches, status:item.status})) }));
