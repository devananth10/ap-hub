import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
function secret(){const s=process.env.AUTH_FLOW_SECRET;return s&&s.length>=32?s:null;}
export function recoveryReady(){return !!secret();}
export function recoveryProof(userId:string,sessionId:string){const s=secret();if(!s)throw new Error("recovery setup missing");const payload=Buffer.from(JSON.stringify({userId,sessionId,expires:Date.now()+600000,nonce:randomUUID()})).toString("base64url");return payload+"."+createHmac("sha256",s).update(payload).digest("base64url");}
export function verifyRecovery(proof:string|undefined,userId:string,sessionId:string){
 try{const s=secret();if(!s||!proof)return false;const [payload,signature,...rest]=proof.split(".");if(rest.length)return false;const expected=createHmac("sha256",s).update(payload).digest();const supplied=Buffer.from(signature,"base64url");if(expected.length!==supplied.length||!timingSafeEqual(expected,supplied))return false;const data=JSON.parse(Buffer.from(payload,"base64url").toString());return data.userId===userId&&data.sessionId===sessionId&&data.expires>Date.now();}catch{return false;}
}
