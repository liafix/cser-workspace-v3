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
  const triageResponsePromise = a.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/triage`) && response.request().method() === 'POST'
  );
  await a.getByRole('button', { name: 'Triage' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  const triageRes = await triageResponsePromise;
  if (!triageRes.ok()) {
    throw new Error(`triage command failed: ${triageRes.status()} - ${await triageRes.text()}`);
  }
  await expect(aMeta.getByText('Triaged', { exact: true })).toBeVisible();

  // 3. Transition: TRIAGED -> ASSIGNED
  const assignResponsePromise = a.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/assign`) && response.request().method() === 'POST'
  );
  await a.getByRole('button', { name: 'Assign' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  const assignRes = await assignResponsePromise;
  if (!assignRes.ok()) {
    throw new Error(`assign command failed: ${assignRes.status()} - ${await assignRes.text()}`);
  }
  await expect(aMeta.getByText('Assigned', { exact: true })).toBeVisible();

  // 4. Direct API assertion confirming assignment preconditions
  const response = await a.request.get(`/api/v1/findings/${findingId}`);
  expect(response.ok()).toBe(true);
  const data = await response.json();
  expect(data.state).toBe('ASSIGNED');
  expect(data.assigneeUserId).toBe('usr-lukas');
  expect(data.task).not.toBeNull();
  expect(data.task.ownerUserId).toBe('usr-lukas');

  // 5. Verification: Log in as Lukas Novak (Ops) and verify assigned state and assignee name
  await loginAs(o, 'Lukas Novak');
  await o.goto(`/app/findings/${findingId}`);

  const oMeta = o.locator('.detail-meta');
  await expect(oMeta.getByText('Assigned', { exact: true })).toBeVisible();

  // Scope assignee owner assertion strictly to the "Owner" definition label
  await expect(o.locator('.definition', { hasText: 'Owner' }).getByText('Lukas Novak')).toBeVisible();

  // 6. Transition: ASSIGNED -> IN_PROGRESS
  const startResponsePromise = o.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/start`) && response.request().method() === 'POST'
  );
  await o.getByRole('button', { name: /Start-remediation/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  const startRes = await startResponsePromise;
  if (!startRes.ok()) {
    throw new Error(`start command failed: ${startRes.status()} - ${await startRes.text()}`);
  }
  await expect(oMeta.getByText('In progress', { exact: true })).toBeVisible();

  // 7. Transition: IN_PROGRESS -> READY_FOR_REVIEW
  const reviewResponsePromise = o.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/request-review`) && response.request().method() === 'POST'
  );
  await o.getByRole('button', { name: /Request-review/i }).click();
  await o.getByRole('button', { name: 'Confirm command' }).click();
  const reviewRes = await reviewResponsePromise;
  if (!reviewRes.ok()) {
    throw new Error(`review command failed: ${reviewRes.status()} - ${await reviewRes.text()}`);
  }
  await expect(oMeta.getByText('Ready for review', { exact: true })).toBeVisible();

  // 8. Verification: Analyst reloads and sees Ready for review
  await a.reload();
  await expect(aMeta.getByText('Ready for review', { exact: true })).toBeVisible();

  // 9. Transition: READY_FOR_REVIEW -> VERIFIED (via Verify command)
  const verifyResponsePromise = a.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/verify`) && response.request().method() === 'POST'
  );
  await a.getByRole('button', { name: 'Verify' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  const verifyRes = await verifyResponsePromise;
  if (!verifyRes.ok()) {
    throw new Error(`verify command failed: ${verifyRes.status()} - ${await verifyRes.text()}`);
  }
  await expect(aMeta.getByText('Verified', { exact: true })).toBeVisible();

  // 10. Transition: VERIFIED -> RESOLVED (via Resolve command)
  const resolveResponsePromise = a.waitForResponse(response =>
    response.url().includes(`/findings/${findingId}/resolve`) && response.request().method() === 'POST'
  );
  await a.getByRole('button', { name: 'Resolve' }).click();
  await a.getByRole('button', { name: 'Confirm command' }).click();
  const resolveRes = await resolveResponsePromise;
  if (!resolveRes.ok()) {
    throw new Error(`resolve command failed: ${resolveRes.status()} - ${await resolveRes.text()}`);
  }
  await expect(aMeta.getByText('Resolved', { exact: true })).toBeVisible();

  await analyst.close();
  await ops.close();
});
