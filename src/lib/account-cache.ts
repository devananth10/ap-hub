import { emptyCloud,validChange,validRecord, type CloudState } from "./cloud-model.ts";
export const GUEST_ATTEMPTS_KEY="prepatlas:guest-attempts:v1";
export const ACCOUNT_CACHE_PREFIX="prepatlas:account:v1:";
export function accountCacheKey(owner:string,tab:string){return ACCOUNT_CACHE_PREFIX+owner+":"+tab;}
export function parseAccountCache(raw:string,owner:string):CloudState{
 const value=JSON.parse(raw);
 if(value.owner!==owner||value.version!==1||!Array.isArray(value.state?.records)||!Array.isArray(value.state?.pending)||!Array.isArray(value.state?.conflicts)||!value.state.records.every(validRecord)||!value.state.pending.every(validChange)||!value.state.conflicts.every((c:{local:unknown;remote:unknown})=>validChange(c.local)&&(c.remote===null||validRecord(c.remote))))throw new Error("Invalid private cache; original data retained.");
 return value.state;
}
export function serializeAccountCache(owner:string,state:CloudState){return JSON.stringify({version:1,owner,state});}
export function readAccountCache(storage:Pick<Storage,"getItem">,key:string,owner:string){const raw=storage.getItem(key);return raw?parseAccountCache(raw,owner):emptyCloud();}
