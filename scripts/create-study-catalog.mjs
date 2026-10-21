// Development-only canonical ID seed generator. No student data or lesson URLs.
import { writeFileSync, mkdirSync } from 'node:fs';
import { courses } from '../src/lib/courses.ts';
import { readFileSync } from 'node:fs';
import { watchedVideoKey } from '../src/lib/resource-policy.ts';
const catalog=JSON.parse(readFileSync(new URL('../src/config/official-resources.json',import.meta.url),'utf8'));
const q=v=>v===null?'null':"'"+v.replaceAll("'","''")+"'";
const rows=(table,cols,values)=>`insert into public.${table} (${cols}) values\n${values.map(row=>'('+row.map(q).join(',')+')').join(',\n')}\non conflict do nothing;\n`;
let sql='-- Canonical IDs only; generated from the existing course/resource registries.\n';
sql+=rows('study_courses','id',courses.map(c=>[c.id]));
sql+=rows('study_topics','course_id,topic_id',courses.flatMap(c=>c.units.flatMap(u=>u.topics.map(t=>[c.id,t.id]))));
sql+=rows('study_resources','id',catalog.resources.map(r=>[r.id]));
sql+=rows('study_videos','video_key,course_id,topic_id',catalog.resources.filter(r=>r.kind==='video'&&r.approval?.status==='approved'&&r.visibility!=='hidden'&&watchedVideoKey(r)).map(r=>[watchedVideoKey(r),r.courseId,r.topicIds[0]||null]));
mkdirSync(new URL('../supabase/migrations/',import.meta.url),{recursive:true});
writeFileSync(new URL('../supabase/migrations/202610210002_catalog.sql',import.meta.url),sql);
writeFileSync(new URL('../src/config/sync-catalog.json',import.meta.url),JSON.stringify({resources:catalog.resources.map(r=>r.id),videos:catalog.resources.filter(r=>r.kind==='video'&&r.approval?.status==='approved'&&r.visibility!=='hidden'&&watchedVideoKey(r)).map(r=>watchedVideoKey(r))},null,2)+'\n');
