import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env['DATABASE_URL'] ?? '',
  },
  migrate: {
    async adapter() {
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: process.env['DATABASE_URL'],
      });
      const { PrismaPg } = await import('@prisma/adapter-pg');
      return new PrismaPg(pool);
    },
  },
});
