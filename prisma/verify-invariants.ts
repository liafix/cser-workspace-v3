import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function countRaw(sql: string): Promise<number> {
  const result = await prisma.$queryRawUnsafe<{ count: number }[]>(sql);
  return Number(result[0]?.count ?? 0);
}

async function main() {
  const checks = {
    resolvedWithoutVerification: await prisma.finding.count({
      where: {
        state: { in: ['VERIFIED', 'RESOLVED'] },
        verifications: { none: { result: 'PASSED' } }
      }
    }),
    activeWithoutTask: await prisma.finding.count({
      where: {
        state: { in: ['ASSIGNED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'VERIFIED', 'RESOLVED'] },
        task: null
      }
    }),
    reviewWithoutEvidence: await prisma.finding.count({
      where: {
        state: { in: ['READY_FOR_REVIEW', 'VERIFIED', 'RESOLVED'] },
        evidence: { none: { status: 'CLEAN' } }
      }
    }),
    acceptedWithoutRecord: await prisma.finding.count({
      where: {
        state: 'ACCEPTED_RISK',
        riskAcceptance: null
      }
    }),
    assignedWithoutOwnerOrSla: await prisma.finding.count({
      where: {
        state: { in: ['ASSIGNED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'VERIFIED'] },
        OR: [
          { assigneeUserId: null },
          { dueAt: null }
        ]
      }
    }),
    crossTenantWorkloads: await countRaw(
      'SELECT count(*)::int FROM "Workload" w JOIN "CloudConnection" c ON w."connectionId" = c.id WHERE w."tenantId" != c."tenantId"'
    ),
    crossTenantFindings: await countRaw(
      'SELECT count(*)::int FROM "Finding" f JOIN "Workload" w ON f."workloadId" = w.id WHERE f."tenantId" != w."tenantId"'
    ),
    crossTenantTasks: await countRaw(
      'SELECT count(*)::int FROM "RemediationTask" t JOIN "Finding" f ON t."findingId" = f.id WHERE t."tenantId" != f."tenantId"'
    ),
    crossTenantEvidence: await countRaw(
      'SELECT count(*)::int FROM "Evidence" e JOIN "Finding" f ON e."findingId" = f.id WHERE e."tenantId" != f."tenantId"'
    ),
    crossTenantVerifications: await countRaw(
      'SELECT count(*)::int FROM "Verification" v JOIN "Finding" f ON v."findingId" = f.id WHERE v."tenantId" != f."tenantId"'
    ),
    crossTenantRiskAcceptances: await countRaw(
      'SELECT count(*)::int FROM "RiskAcceptance" r JOIN "Finding" f ON r."findingId" = f.id WHERE r."tenantId" != f."tenantId"'
    ),
    providerWorkloadMismatches: await countRaw(
      'SELECT count(*)::int FROM "Workload" w JOIN "CloudConnection" c ON w."connectionId" = c.id WHERE w.provider != c.provider'
    ),
    providerPlanMismatches: await countRaw(
      'SELECT count(*)::int FROM "EnablementPlan" p JOIN "CloudConnection" c ON p."connectionId" = c.id WHERE p.provider != c.provider'
    )
  };

  console.log(JSON.stringify(checks, null, 2));
  if (Object.values(checks).some(x => x !== 0)) {
    process.exitCode = 1;
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
