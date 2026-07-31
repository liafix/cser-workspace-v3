import { beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { VersioningType, ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { ProblemFilter } from '../src/common/problem.filter';

describe('Findings API contract', () => {
  let app: INestApplication;

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
      .post('/api/v1/findings/fnd-00003/request-review')
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
      .post('/api/v1/findings/fnd-00003/request-review')
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
});
