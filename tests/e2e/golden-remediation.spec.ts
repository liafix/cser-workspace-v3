import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test('golden remediation flow preserves server-enforced commands', async ({ browser }, testInfo) => {
  const isMobile = testInfo.project.name === 'mobile';
  const findingId = isMobile ? 'fnd-00010' : 'FND-CRIT-0042';

  const analyst = await browser.newContext(), ops = await browser.newContext();
  const a = await analyst.newPage(), o = await ops.newPage();
  await loginAs(a, 'Sofia Marin');
  await a.goto(`/app/findings/${findingId}`);
  await a.getByRole('button', { name: 'Triage' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(a.getByText(/Triaged/i)).toBeVisible();
  await a.getByRole('button', { name: 'Assign' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await loginAs(o, 'Lukas Novak');
  await o.goto(`/app/findings/${findingId}`);
  await o.getByRole('button', { name: /Start remediation/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  await o.getByRole('button', { name: /Request review/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  await a.reload();
  await a.getByRole('button', { name: 'Verify' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await a.getByRole('button', { name: 'Resolve' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(a.getByText(/Resolved/i)).toBeVisible();
  await analyst.close();
  await ops.close();
});
