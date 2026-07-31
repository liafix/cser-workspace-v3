import { beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { VersioningType, ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { ProblemFilter } from '../src/common/problem.filter';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Findings API contract', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api', { exclude: ['health/live', 'health/ready', 'metrics'] });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new ProblemFilter());
    await app.init();
    prisma = module.get(PrismaService);
  });

  it('rejects an unauthenticated list', async () => {
    await request(app.getHttpServer()).get('/api/v1/findings').expect(401);
  });

  it('exposes liveness', async () => {
    await request(app.getHttpServer()).get('/v1/health/live').expect(200);
  });

  it('does not expose a generic arbitrary transition endpoint', async () => {
    await request(app.getHttpServer()).post('/api/v1/findings/FND-CRIT-0042/transition').expect(404);
  });

  it('rejects request-review when unauthenticated', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00003/request-review')
      .send({
        structuredEvidence: 'Evidence of safe remediation that is valid and more than twelve characters long.',
        checklistComplete: true,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(401);
  });

  it('rejects request-review when evidence is missing or too short', async () => {
    const switchRes = await request(app.getHttpServer())
      .post('/api/v1/demo/switch-identity')
      .send({ userId: 'usr-lukas' });
    const cookie = switchRes.headers['set-cookie'] as any;
    const csrfToken = switchRes.body.csrfToken;

    await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00013/request-review')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrfToken)
      .set('if-match', '1')
      .set('idempotency-key', 'idempotency-key-test-short-evidence-123')
      .send({
        structuredEvidence: 'too-short',
        checklistComplete: true,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(400);
  });

  it('rejects request-review when checklist is incomplete', async () => {
    const switchRes = await request(app.getHttpServer())
      .post('/api/v1/demo/switch-identity')
      .send({ userId: 'usr-lukas' });
    const cookie = switchRes.headers['set-cookie'] as any;
    const csrfToken = switchRes.body.csrfToken;

    await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00033/request-review')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrfToken)
      .set('if-match', '1')
      .set('idempotency-key', 'idempotency-key-test-incomplete-checklist-123')
      .send({
        structuredEvidence: 'Evidence of safe remediation that is valid and more than twelve characters long.',
        checklistComplete: false,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(422);
  });

  it('rejects request-review when evidence status is not CLEAN', async () => {
    const switchRes = await request(app.getHttpServer())
      .post('/api/v1/demo/switch-identity')
      .send({ userId: 'usr-lukas' });
    const cookie = switchRes.headers['set-cookie'] as any;
    const csrfToken = switchRes.body.csrfToken;

    await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00023/request-review')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrfToken)
      .set('if-match', '1')
      .set('idempotency-key', 'idempotency-key-test-quarantine-evidence-123')
      .send({
        structuredEvidence: 'Evidence contains quarantine indicator.',
        checklistComplete: true,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(422);
  });

  it('positive request-review succeeds and returns READY_FOR_REVIEW when all preconditions are met', async () => {
    const switchRes = await request(app.getHttpServer())
      .post('/api/v1/demo/switch-identity')
      .send({ userId: 'usr-lukas' });
    const cookie = switchRes.headers['set-cookie'] as any;
    const csrfToken = switchRes.body.csrfToken;

    const res = await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00003/request-review')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrfToken)
      .set('if-match', '1')
      .set('idempotency-key', 'idempotency-key-test-positive-review-123')
      .send({
        structuredEvidence: 'Evidence of safe remediation that is valid and more than twelve characters long.',
        checklistComplete: true,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(201);

    expect(res.body.state).toBe('READY_FOR_REVIEW');
  });

  it('verifies a rejected transaction rolls back completely leaving state unchanged', async () => {
    const switchRes = await request(app.getHttpServer())
      .post('/api/v1/demo/switch-identity')
      .send({ userId: 'usr-lukas' });
    const cookie = switchRes.headers['set-cookie'] as any;
    const csrfToken = switchRes.body.csrfToken;

    const idempotencyKey = 'idempotency-key-test-rollback-verification-123';

    // Call request-review with invalid checklistComplete: false to trigger transaction rollback
    await request(app.getHttpServer())
      .post('/api/v1/findings/fnd-00043/request-review')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrfToken)
      .set('if-match', '1')
      .set('idempotency-key', idempotencyKey)
      .send({
        structuredEvidence: 'Evidence of safe remediation that is valid and more than twelve characters long.',
        checklistComplete: false,
        remediationSummary: 'Fictional remediation summary that is valid and more than twelve characters long.'
      })
      .expect(422);

    // Fetch the finding from the database directly using prisma and verify rollback
    const finding = await prisma.finding.findUnique({
      where: { id: 'fnd-00043' },
      include: { evidence: true, task: true }
    });

    expect(finding).not.toBeNull();
    expect(finding!.state).toBe('IN_PROGRESS'); // Stays IN_PROGRESS!
    expect(finding!.evidence.length).toBe(0); // No evidence created!

    // Checklist is unchanged and still has done: false for all items
    expect(finding!.task).not.toBeNull();
    const taskChecklist = finding!.task!.checklist as Array<{ done: boolean }>;
    expect(taskChecklist.every(item => !item.done)).toBe(true);

    // No idempotency record was created
    const idempotency = await prisma.idempotencyRecord.findFirst({
      where: { key: idempotencyKey }
    });
    expect(idempotency).toBeNull();
  });
});
