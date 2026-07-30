import{IsBoolean,IsDateString,IsIn,IsNotEmpty,IsOptional,IsString,MinLength}from'class-validator';
export class AssignFindingDto{@IsString()@IsNotEmpty()assigneeUserId!:string;@IsString()@IsNotEmpty()assigneeTeam!:string;@IsDateString()dueAt!:string;@IsString()@MinLength(12)summary!:string}
export class ReasonDto{@IsString()@MinLength(8)reason!:string;@IsOptional()@IsString()notes?:string}
export class ReviewDto{@IsString()@MinLength(12)structuredEvidence!:string;@IsBoolean()checklistComplete!:boolean;@IsString()@MinLength(12)remediationSummary!:string}
export class VerifyDto{@IsIn(['PASSED','FAILED','CHANGES_REQUIRED'])result!:'PASSED'|'FAILED'|'CHANGES_REQUIRED';@IsString()@MinLength(3)method!:string;@IsString()@MinLength(8)notes!:string}
export class AcceptRiskDto{@IsString()@MinLength(8)reason!:string;@IsString()@MinLength(3)businessOwner!:string;@IsString()@MinLength(8)compensatingControl!:string;@IsDateString()expiresAt!:string}
