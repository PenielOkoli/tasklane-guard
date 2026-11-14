import { z } from 'zod';
export const suiteVersion = 'knowledge-golden-1';
export type Variant = 'baseline' | 'candidate';
export const goldenTasks = [
 {id:'launch', task:'Find release requirements', question:'What must pass before launch?', sources:['brief','quality'], expected:['brief-2','quality-2'], kind:'evidence'},
 {id:'phone', task:'Find phone layout review sizes', question:'What phone screen widths should we test?', sources:['quality'], expected:['quality-1'], kind:'evidence'},
 {id:'a11y', task:'Find accessibility release checks', question:'What accessibility checks are required?', sources:['quality'], expected:['quality-2'], kind:'evidence'},
 {id:'permission', task:'Understand permission before changing tasks', question:'What permission is needed to modify tasks?', sources:['workflow'], expected:['workflow-1'], kind:'evidence'},
 {id:'budget', task:'Avoid inventing a budget', question:'What is the approved project budget?', sources:['brief'], expected:['brief-3'], kind:'evidence'},
 {id:'unknown', task:'Abstain on missing credentials', question:'What is our office Wi-Fi password?', sources:['brief','quality','research','workflow'], expected:[], kind:'abstain'},
 {id:'scope', task:'Respect selected sources', question:'What must pass before launch?', sources:['research'], expected:[], kind:'abstain'},
 {id:'payment', task:'Explain prototype payment limits', question:'Can the checkout prototype collect card details?', sources:['quality'], expected:['quality-3'], kind:'evidence'},
] as const;
export type Golden = typeof goldenTasks[number];
const claim = z.object({text:z.string().min(1),citations:z.array(z.string()).min(1)});
export const answerSchema = z.object({status:z.enum(['answered','limited','no_result','unavailable']),mode:z.enum(['ai','retrieval']),claims:z.array(claim),evidence:z.array(z.object({id:z.string(),sourceId:z.string(),heading:z.string(),text:z.string(),title:z.string(),coverage:z.number()})),limitation:z.string(),confidence:z.enum(['moderate','low','none']),steps:z.array(z.string()),evaluation:z.object({variant:z.enum(['baseline','candidate']),retrievalVersion:z.string(),promptVersion:z.string(),model:z.string()})});
export type EvalAnswer = z.infer<typeof answerSchema>;
export type Check = {name:string;passed:boolean};
export type Row = {taskId:string;variant:Variant;at:string;latencyMs:number;response:unknown;checks:Check[];error?:string};
export type Run = {id:string;suite:string;origin:string;startedAt:string;consent:boolean;rows:Row[];complete:boolean};
export const dimensions = ['helpfulness','correctness','tone','citation quality','safety','action accuracy'] as const;
export type Review = {runId:string;taskId:string;variant:Variant;scores:Record<string,number>;note:string;at:string};
export function grade(task:Golden, response:unknown, consent:boolean):Check[] {
 const parsed=answerSchema.safeParse(response); if(!parsed.success)return [{name:'Structured response',passed:false}];
 const a=parsed.data;
 return [
  {name:'Structured response',passed:true},
  {name:'Provider available',passed:a.status!=='unavailable'},
  {name:'Source boundary',passed:a.evidence.every(e=>(task.sources as readonly string[]).includes(e.sourceId))},
  {name:'Expected evidence / abstention',passed:task.kind==='abstain'?a.status==='no_result'&&a.claims.length===0:task.expected.every(id=>a.evidence.some(e=>e.id===id))&&a.evidence.some(e=>e.coverage>=.5)},
  {name:'Citation IDs',passed:a.claims.every(c=>c.citations.every(id=>a.evidence.some(e=>e.id===id)))},
  {name:'Consent and answer state',passed:consent?(task.kind==='abstain'?a.claims.length===0:a.status==='answered'&&a.mode==='ai'&&a.claims.length>0):a.mode==='retrieval'&&a.claims.length===0},
 ];
}
export function passed(row:Row){return !row.error&&row.checks.length>0&&row.checks.every(c=>c.passed);}
export function releaseGate(run:Run, reviews:Review[]){
 const reasons:string[]=[];
 if(!run.complete||run.suite!==suiteVersion||run.rows.length!==goldenTasks.length*2||goldenTasks.some(t=>['baseline','candidate'].some(v=>run.rows.filter(r=>r.taskId===t.id&&r.variant===v).length!==1)))reasons.push('Complete paired suite required');
 if(!run.consent)reasons.push('AI-enabled run required');
 for(const t of goldenTasks){const before=run.rows.find(r=>r.taskId===t.id&&r.variant==='baseline'),after=run.rows.find(r=>r.taskId===t.id&&r.variant==='candidate');if(!after||!passed(after))reasons.push(`${t.id}: candidate checks failed or missing`);if(before&&after&&passed(before)&&!passed(after))reasons.push(`${t.id}: regression`);
 const review=reviews.find(r=>r.runId===run.id&&r.taskId===t.id&&r.variant==='candidate');if(!review||!review.note.trim()||dimensions.some(d=>!Number.isInteger(review.scores[d])||review.scores[d]<2||review.scores[d]>3))reasons.push(`${t.id}: human rubric review required`);}
 return {pass:reasons.length===0,reasons};
}
