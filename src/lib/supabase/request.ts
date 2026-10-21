export function timedFetch(input:RequestInfo|URL,init?:RequestInit){
 const signals=[AbortSignal.timeout(15000),...(init?.signal?[init.signal]:[])];
 return fetch(input,{...init,signal:AbortSignal.any(signals)});
}
