import{DomainError}from'@cser/domain';import type{AuthContext}from'./request-context';
export function requirePermission(auth:AuthContext,permission:string){if(!auth.permissions.includes(permission))throw new DomainError('PERMISSION_DENIED',`Permission ${permission} is required.`,403)}
export function enforceOperationsScope(auth:AuthContext,assigneeUserId:string|null){if(auth.role==='CLOUD_OPERATIONS'&&assigneeUserId!==auth.userId)throw new DomainError('OBJECT_SCOPE_DENIED','Cloud Operations can access only assigned remediation work.',404)}
