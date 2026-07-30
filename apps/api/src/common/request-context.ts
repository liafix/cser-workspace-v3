import type{Request}from'express';import type{Role}from'@cser/contracts';
export type AuthContext={userId:string;tenantId:string;tenantKey:string;role:Role;permissions:string[];csrfToken:string};
export type CserRequest=Request&{auth?:AuthContext;correlationId?:string};
