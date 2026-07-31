-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SECURITY_ANALYST', 'CLOUD_OPERATIONS', 'SECURITY_MANAGER', 'READ_ONLY_AUDITOR', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('AZURE', 'AWS', 'GCP');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "FindingState" AS ENUM ('OPEN', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'VERIFIED', 'RESOLVED', 'ACCEPTED_RISK', 'DEFERRED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "IntegrationState" AS ENUM ('HEALTHY', 'DEGRADED', 'OFFLINE', 'AUTH_ERROR', 'RATE_LIMITED', 'SYNCING', 'STALE', 'DISABLED');

-- CreateEnum
CREATE TYPE "TaskState" AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'REVIEW_REQUESTED', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EvidenceState" AS ENUM ('QUARANTINED', 'CLEAN', 'REJECTED_TYPE', 'REJECTED_SIZE', 'REJECTED_SCAN');

-- CreateEnum
CREATE TYPE "OperationState" AS ENUM ('DRAFT', 'VALIDATING', 'READY', 'QUEUED', 'EXECUTING', 'SUCCEEDED', 'PARTIALLY_SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "externalSubject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CloudConnection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "alias" TEXT NOT NULL,
    "externalScopeId" TEXT NOT NULL,
    "state" "IntegrationState" NOT NULL,
    "freshnessStatus" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3),
    "lastSuccessfulSyncAt" TIMESTAMP(3),
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "errorCode" TEXT,
    "circuitState" TEXT NOT NULL DEFAULT 'CLOSED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CloudConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workload" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scopeAlias" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "osFamily" TEXT NOT NULL,
    "osVersion" TEXT,
    "eligibility" TEXT NOT NULL,
    "protectionStatus" TEXT NOT NULL,
    "assetCriticality" TEXT NOT NULL,
    "internetExposure" BOOLEAN NOT NULL DEFAULT false,
    "ownerTeam" TEXT,
    "tags" TEXT[],
    "providerPayloadHash" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "workloadId" TEXT NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "confidence" TEXT NOT NULL,
    "state" "FindingState" NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "riskExplanation" JSONB NOT NULL,
    "assigneeUserId" TEXT,
    "assigneeTeam" TEXT,
    "dueAt" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemediationTask" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "ownerTeam" TEXT,
    "state" "TaskState" NOT NULL,
    "summary" TEXT NOT NULL,
    "checklist" JSONB NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "remediationAuthorId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RemediationTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FindingComment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "taskId" TEXT,
    "authorUserId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EvidenceState" NOT NULL,
    "structuredNote" TEXT NOT NULL,
    "objectKey" TEXT,
    "originalName" TEXT,
    "mimeType" TEXT,
    "size" INTEGER,
    "sha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "verifierUserId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAcceptance" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "approvedByUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "businessOwner" TEXT NOT NULL,
    "compensatingControl" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnablementPlan" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "state" "OperationState" NOT NULL,
    "targetCount" INTEGER NOT NULL,
    "excludedCount" INTEGER NOT NULL,
    "autoEnableNew" BOOLEAN NOT NULL,
    "autoEnableExisting" BOOLEAN NOT NULL,
    "scope" JSONB NOT NULL,
    "targets" JSONB NOT NULL,
    "exclusions" JSONB NOT NULL,
    "preview" JSONB,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "errorCode" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnablementPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationOperation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "planId" TEXT,
    "type" TEXT NOT NULL,
    "state" "OperationState" NOT NULL,
    "progress" INTEGER NOT NULL,
    "result" JSONB,
    "errorCode" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedView" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpactScenario" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpactScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "actorRole" "Role" NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeHash" TEXT,
    "afterHash" TEXT,
    "safeDiff" JSONB NOT NULL,
    "reason" TEXT,
    "correlationId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseStatus" INTEGER NOT NULL,
    "responseBody" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_key_key" ON "Tenant"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalSubject_key" ON "User"("externalSubject");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Membership_tenantId_role_idx" ON "Membership"("tenantId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_tenantId_userId_key" ON "Membership"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "CloudConnection_tenantId_state_idx" ON "CloudConnection"("tenantId", "state");

-- CreateIndex
CREATE INDEX "Workload_tenantId_provider_environment_protectionStatus_idx" ON "Workload"("tenantId", "provider", "environment", "protectionStatus");

-- CreateIndex
CREATE INDEX "Workload_tenantId_lastSeenAt_idx" ON "Workload"("tenantId", "lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "Workload_tenantId_provider_externalId_key" ON "Workload"("tenantId", "provider", "externalId");

-- CreateIndex
CREATE INDEX "Finding_tenantId_state_severity_idx" ON "Finding"("tenantId", "state", "severity");

-- CreateIndex
CREATE INDEX "Finding_tenantId_assigneeUserId_dueAt_idx" ON "Finding"("tenantId", "assigneeUserId", "dueAt");

-- CreateIndex
CREATE INDEX "Finding_tenantId_riskScore_idx" ON "Finding"("tenantId", "riskScore");

-- CreateIndex
CREATE UNIQUE INDEX "RemediationTask_findingId_key" ON "RemediationTask"("findingId");

-- CreateIndex
CREATE INDEX "RemediationTask_tenantId_state_ownerUserId_idx" ON "RemediationTask"("tenantId", "state", "ownerUserId");

-- CreateIndex
CREATE INDEX "FindingComment_tenantId_findingId_createdAt_idx" ON "FindingComment"("tenantId", "findingId", "createdAt");

-- CreateIndex
CREATE INDEX "Evidence_tenantId_findingId_status_idx" ON "Evidence"("tenantId", "findingId", "status");

-- CreateIndex
CREATE INDEX "Verification_tenantId_findingId_result_idx" ON "Verification"("tenantId", "findingId", "result");

-- CreateIndex
CREATE UNIQUE INDEX "RiskAcceptance_findingId_key" ON "RiskAcceptance"("findingId");

-- CreateIndex
CREATE INDEX "RiskAcceptance_tenantId_expiresAt_idx" ON "RiskAcceptance"("tenantId", "expiresAt");

-- CreateIndex
CREATE INDEX "EnablementPlan_tenantId_state_idx" ON "EnablementPlan"("tenantId", "state");

-- CreateIndex
CREATE INDEX "IntegrationOperation_tenantId_state_createdAt_idx" ON "IntegrationOperation"("tenantId", "state", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationOperation_tenantId_idempotencyKey_key" ON "IntegrationOperation"("tenantId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "SavedView_tenantId_userId_entityType_idx" ON "SavedView"("tenantId", "userId", "entityType");

-- CreateIndex
CREATE INDEX "ImpactScenario_tenantId_scenario_idx" ON "ImpactScenario"("tenantId", "scenario");

-- CreateIndex
CREATE INDEX "Notification_tenantId_userId_readAt_idx" ON "Notification"("tenantId", "userId", "readAt");

-- CreateIndex
CREATE INDEX "AuditEvent_tenantId_createdAt_idx" ON "AuditEvent"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditEvent_tenantId_entityType_entityId_idx" ON "AuditEvent"("tenantId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_tenantId_route_key_key" ON "IdempotencyRecord"("tenantId", "route", "key");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CloudConnection" ADD CONSTRAINT "CloudConnection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workload" ADD CONSTRAINT "Workload_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workload" ADD CONSTRAINT "Workload_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "CloudConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_workloadId_fkey" FOREIGN KEY ("workloadId") REFERENCES "Workload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemediationTask" ADD CONSTRAINT "RemediationTask_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingComment" ADD CONSTRAINT "FindingComment_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FindingComment" ADD CONSTRAINT "FindingComment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RemediationTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verifierUserId_fkey" FOREIGN KEY ("verifierUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAcceptance" ADD CONSTRAINT "RiskAcceptance_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnablementPlan" ADD CONSTRAINT "EnablementPlan_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "CloudConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationOperation" ADD CONSTRAINT "IntegrationOperation_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "CloudConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationOperation" ADD CONSTRAINT "IntegrationOperation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "EnablementPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedView" ADD CONSTRAINT "SavedView_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImpactScenario" ADD CONSTRAINT "ImpactScenario_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
