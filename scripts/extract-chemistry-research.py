"""Reproduce source-only curriculum/video inventories. Does not publish content."""
from pathlib import Path
from pypdf import PdfReader
from html.parser import HTMLParser
from urllib.parse import urlparse
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1]
out = root / 'content-drafts/chemistry/research'
out.mkdir(parents=True, exist_ok=True)
ced = root / 'tmp/pdfs/chemistry-ced.pdf'
topics = []
for page_index, page in enumerate(PdfReader(ced).pages):
    if page_index < 36 or page_index > 184:
        continue
    text = page.extract_text().replace('\x07', ' ')
    match = re.search(r'TOPIC\s+(\d+\.\d+)\s+(.+?)(?:Required Course Content|R Requir|Requir equired)', text, re.S)
    if not match:
        continue
    title = re.split(r'Course\s+Framework|Return to|continued on next page', match[2])[0]
    title = ' '.join(title.split()).replace('Buf fers', 'Buffers').replace('Henderson- Hasselbalch', 'Henderson-Hasselbalch')
    topics.append({'number': match[1], 'title': title, 'pdfPage': page_index + 1, 'printedPage': page_index - 6})
assert len(topics) == len({x['number'] for x in topics}) == 91
assert [sum(x['number'].startswith(f'{unit}.') for x in topics) for unit in range(1,10)] == [8,7,13,9,11,9,12,11,11]
(out / 'official-topics.json').write_text(json.dumps({
    'source': 'https://apcentral.collegeboard.org/media/pdf/ap-chemistry-course-and-exam-description.pdf',
    'edition': 'Effective Fall 2024; applicable to 2026-27 per College Board changes overview',
    'accessed': '2026-10-17', 'sourceSha256': hashlib.sha256(ced.read_bytes()).hexdigest(), 'topics': topics
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

class VideoIndex(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_cell = False
        self.cell = ''
        self.links = []
        self.anchor = None
        self.title = ''
        self.rows = []
    def handle_starttag(self, tag, attrs):
        if tag == 'td':
            self.in_cell, self.cell, self.links = True, '', []
        if tag == 'a' and self.in_cell:
            self.anchor, self.title = dict(attrs).get('href'), ''
    def handle_data(self, data):
        if self.in_cell: self.cell += data
        if self.anchor: self.title += data
    def handle_endtag(self, tag):
        if tag == 'a' and self.anchor:
            if urlparse(self.anchor).netloc in ('youtu.be', 'www.youtube.com', 'youtube.com'):
                self.links.append((self.anchor, self.title.strip()))
            self.anchor = None
        if tag == 'td':
            for url, title in self.links:
                label = self.cell.split('–')[0].strip()
                numbers = list(dict.fromkeys(re.findall(r'\b[1-9]\.\d+', label)))
                self.rows.append({'sourceLabel': label, 'title': title, 'url': url, 'officialTopics': numbers,
                    'approvalStatus': 'pending-owner-approval', 'indexLinkVerified': True,
                    'providerPlaybackVerified': False, 'embedPermissionVerified': False})
            self.in_cell, self.anchor = False, None

parser = VideoIndex()
parser.feed((root / 'tmp/pdfs/jeremy-krug.html').read_text(encoding='utf-8-sig'))
official = {x['number'] for x in topics}
for row in parser.rows:
    assert row['officialTopics'] and set(row['officialTopics']) <= official, row
    parsed = urlparse(row['url'])
    assert parsed.scheme == 'https' and re.fullmatch(r'/[A-Za-z0-9_-]{11}', parsed.path), row
covered = set(n for row in parser.rows for n in row['officialTopics'])
(out / 'video-candidates.json').write_text(json.dumps({
    'source': 'https://jeremykrug.com/ap-chem-videos/', 'accessed': '2026-10-17',
    'verification': 'Exact YouTube URLs and topic labels extracted from the creator index; no playback or embed permission certification.',
    'coveredTopicCount': len(covered), 'uncoveredTopics': sorted(official-covered, key=lambda x: tuple(map(int,x.split('.')))),
    'videos': parser.rows
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Official topics: {len(topics)}. Creator-index links: {len(parser.rows)}. Topic coverage: {len(covered)}/91. No publishing performed.')
