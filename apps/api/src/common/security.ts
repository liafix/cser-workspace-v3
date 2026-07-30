import{createHash}from'node:crypto';import{DomainError}from'@cser/domain';
function stable(value:unknown):unknown{if(Array.isArray(value))return value.map(stable);if(value!==null&&typeof value==='object'){return Object.fromEntries(Object.entries(value as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([key,item])=>[key,stable(item)]))}return value}
export const hashJson=(value:unknown)=>createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export function parseVersion(value:string|undefined){if(!value)throw new DomainError('PRECONDITION_REQUIRED','Send the current ETag in If-Match.',428);const match=value.match(/(\d+)/);if(!match)throw new DomainError('INVALID_ETAG','If-Match is invalid.',400);return Number(match[1])}
export function requireIdempotency(value:string|undefined){if(!value||value.length<8)throw new DomainError('IDEMPOTENCY_REQUIRED','A valid Idempotency-Key is required.',428);return value}
