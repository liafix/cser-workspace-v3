import type {FindingState,ImpactInputs,ImpactResult,Role,Severity} from '@cser/contracts';
export class DomainError extends Error{constructor(public readonly code:string,message:string,public readonly status=422){super(message)}}
export type FindingContext={state:FindingState;severity:Severity;role:Role;hasTask:boolean;hasCleanEvidence:boolean;checklistComplete:boolean;remediationAuthorId:string|null;actorId:string;passedVerification:boolean;blockingTask:boolean};
export function assertTransition(command:string,ctx:FindingContext):FindingState{
 const analyst=ctx.role==='SECURITY_ANALYST'||ctx.role==='PLATFORM_ADMIN';
 switch(command){
  case'triage':if(!analyst||ctx.state!=='OPEN')throw new DomainError('INVALID_TRANSITION','Only an analyst can triage an open finding.');return'TRIAGED';
  case'assign':if(!analyst||ctx.state!=='TRIAGED')throw new DomainError('INVALID_TRANSITION','Only a triaged finding can be assigned.');return'ASSIGNED';
  case'start':if(ctx.role!=='CLOUD_OPERATIONS'||ctx.state!=='ASSIGNED'||!ctx.hasTask)throw new DomainError('INVALID_TRANSITION','Assigned work with a remediation task is required.');return'IN_PROGRESS';
  case'request-review':if(ctx.role!=='CLOUD_OPERATIONS'||ctx.state!=='IN_PROGRESS'||!ctx.hasCleanEvidence||!ctx.checklistComplete)throw new DomainError('REVIEW_REQUIREMENTS_MISSING','Evidence and a completed checklist are required.');return'READY_FOR_REVIEW';
  case'verify':if(!analyst||ctx.state!=='READY_FOR_REVIEW')throw new DomainError('INVALID_TRANSITION','Finding is not ready for verification.');if(ctx.severity==='CRITICAL'&&ctx.remediationAuthorId===ctx.actorId)throw new DomainError('SEPARATION_OF_DUTIES','Critical remediation requires an independent verifier.',403);return'VERIFIED';
  case'resolve':if(!analyst||ctx.state!=='VERIFIED'||!ctx.passedVerification||ctx.blockingTask)throw new DomainError('RESOLUTION_REQUIREMENTS_MISSING','Passed verification and no blocking task are required.');return'RESOLVED';
  case'accept-risk':if(ctx.role!=='SECURITY_MANAGER'&&ctx.role!=='PLATFORM_ADMIN')throw new DomainError('PERMISSION_DENIED','Manager permission is required.',403);if(['RESOLVED','FALSE_POSITIVE'].includes(ctx.state))throw new DomainError('INVALID_TRANSITION','Closed findings cannot be accepted.');return'ACCEPTED_RISK';
  case'defer':if(!analyst||['RESOLVED','FALSE_POSITIVE'].includes(ctx.state))throw new DomainError('INVALID_TRANSITION','Only an active finding can be deferred.');return'DEFERRED';
  case'false-positive':if(!analyst||ctx.state==='RESOLVED')throw new DomainError('INVALID_TRANSITION','Only an analyst can classify an active finding.');return'FALSE_POSITIVE';
  case'reopen':if(!analyst||!['DEFERRED','FALSE_POSITIVE','ACCEPTED_RISK'].includes(ctx.state))throw new DomainError('INVALID_TRANSITION','Only a deferred, false-positive or accepted-risk finding can be reopened.');return'TRIAGED';
  default:throw new DomainError('UNKNOWN_COMMAND','Unsupported finding command.')
 }
}
export function calculateRisk(input:{severity:Severity;confidence:'HIGH'|'MEDIUM'|'LOW';production:boolean;internetExposed:boolean;unprotected:boolean;criticalAsset:boolean;overdue:boolean;compensatingControl:boolean}){
 const severityMap: Record<Severity, number> = {
  CRITICAL: 45,
  HIGH: 32,
  MEDIUM: 18,
  LOW: 8
 };
 const confidenceMap: Record<'HIGH' | 'MEDIUM' | 'LOW', number> = {
  HIGH: 12,
  MEDIUM: 6,
  LOW: 2
 };
 const severity = severityMap[input.severity];
 const confidence = confidenceMap[input.confidence];
 const explanation=[{label:`${input.severity} severity`,points:severity},{label:`${input.confidence} confidence`,points:confidence},{label:'Production exposure',points:input.production?10:0},{label:'Internet exposure',points:input.internetExposed?12:0},{label:'Unprotected workload',points:input.unprotected?10:0},{label:'Critical asset',points:input.criticalAsset?8:0},{label:'Overdue SLA',points:input.overdue?8:0},{label:'Compensating control',points:input.compensatingControl?-10:0}].filter(x=>x.points!==0);
 return{score:Math.max(0,Math.min(100,explanation.reduce((s,x)=>s+x.points,0))),explanation}
}
export function calculateImpact(i:ImpactInputs):ImpactResult{
 const supportSaving=i.activeOrganizations*i.supportContactsPerOrgPerYear*i.deflectionRate*i.averageContactHours*i.loadedSupportHourValue;
 const onboardingSaving=i.onboardingsPerYear*i.savedHoursPerOnboarding*i.technicalHourValue;
 const expansionContribution=i.qualifiedExpansionEvents*i.contributionPerExpansion;
 const retentionContribution=i.retainedCustomers*i.annualContributionPerRetainedCustomer;
 const grossValue=supportSaving+onboardingSaving+expansionContribution+retentionContribution,netAnnualValue=grossValue-i.annualOperatingCost;
 return{supportSaving,onboardingSaving,expansionContribution,retentionContribution,grossValue,netAnnualValue,paybackMonths:netAnnualValue>0?i.initialInvestment/(netAnnualValue/12):null}
}
