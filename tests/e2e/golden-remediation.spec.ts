import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test('golden remediation flow preserves server-enforced commands', async ({ browser }, testInfo) => {
  const isMobile = testInfo.project.name === 'mobile';
  const retry = testInfo.retry;

  // Dedicated deterministic OPEN finding for each project and retry attempt
  let findingId = 'fnd-00010';
  if (!isMobile) {
    findingId = retry === 0 ? 'fnd-00010' : 'fnd-00020';
  } else {
    findingId = retry === 0 ? 'fnd-00030' : 'fnd-00040';
  }

  const analyst = await browser.newContext(), ops = await browser.newContext();
  const a = await analyst.newPage(), o = await ops.newPage();

  // 1. Initial State: OPEN
  await loginAs(a, 'Sofia Marin');
  await a.goto(`/app/findings/${findingId}`);

  // Scope state assertions strictly to the detail metadata container
  const aMeta = a.locator('.detail-meta');
  await expect(aMeta.getByText('Open', { exact: true })).toBeVisible();

  // 2. Transition: OPEN -> TRIAGED
  await a.getByRole('button', { name: 'Triage' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(aMeta.getByText('Triaged', { exact: true })).toBeVisible();

  // 3. Transition: TRIAGED -> ASSIGNED
  await a.getByRole('button', { name: 'Assign' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(aMeta.getByText('Assigned', { exact: true })).toBeVisible();

  // 4. Verification: Log in as Lukas Novak (Ops) and verify assigned state and assignee name
  await loginAs(o, 'Lukas Novak');
  await o.goto(`/app/findings/${findingId}`);

  const oMeta = o.locator('.detail-meta');
  await expect(oMeta.getByText('Assigned', { exact: true })).toBeVisible();

  // Scope assignee owner assertion strictly to the "Owner" definition label
  await expect(o.locator('.definition', { hasText: 'Owner' }).getByText('Lukas Novak')).toBeVisible();

  // 5. Transition: ASSIGNED -> IN_PROGRESS
  await o.getByRole('button', { name: /Start remediation/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  await expect(oMeta.getByText('In progress', { exact: true })).toBeVisible();

  // 6. Transition: IN_PROGRESS -> READY_FOR_REVIEW
  await o.getByRole('button', { name: /Request review/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  await expect(oMeta.getByText('Ready for review', { exact: true })).toBeVisible();

  // 7. Verification: Analyst reloads and sees Ready for review
  await a.reload();
  await expect(aMeta.getByText('Ready for review', { exact: true })).toBeVisible();

  // 8. Transition: READY_FOR_REVIEW -> VERIFIED (via Verify command)
  await a.getByRole('button', { name: 'Verify' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(aMeta.getByText('Verified', { exact: true })).toBeVisible();

  // 9. Transition: VERIFIED -> RESOLVED (via Resolve command)
  await a.getByRole('button', { name: 'Resolve' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  await expect(aMeta.getByText('Resolved', { exact: true })).toBeVisible();

  await analyst.close();
  await ops.close();
});
