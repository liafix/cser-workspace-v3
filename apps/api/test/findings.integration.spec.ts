import { beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { VersioningType, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Findings API contract', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['health/live', 'health/ready', 'metrics'] });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
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
});
