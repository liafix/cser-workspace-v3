'use strict';
const fs = require('node:fs');
const crypto = require('node:crypto');
const { openDatabase, migrate, resolveDbPath } = require('../server/db');

const NOW = new Date('2026-07-29T10:24:00.000Z');
const iso = (offsetHours = 0) => new Date(NOW.getTime() + offsetHours * 3_600_000).toISOString();
const id = (prefix, value) => `${prefix}-${String(value).padStart(5, '0')}`;
function rng(seed) { let t = seed >>> 0; return () => { t += 0x6D2B79F5; let r = t; r = Math.imul(r ^ (r >>> 15), r | 1); r ^= r + Math.imul(r ^ (r >>> 7), r | 61); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
function choose(random, values) { return values[Math.floor(random() * values.length)]; }
function weighted(random, entries) { const n = random(); let acc = 0; for (const [value, weight] of entries) { acc += weight; if (n <= acc) return value; } return entries.at(-1)[0]; }
function hash(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function resetDatabase() { const dbPath = resolveDbPath(); for (const suffix of ['', '-shm', '-wal']) { try { fs.unlinkSync(dbPath + suffix); } catch {} } }

if (process.argv.includes('--reset')) resetDatabase();
const db = openDatabase(); migrate(db);
const existing = db.prepare('SELECT COUNT(*) count FROM tenants').get().count;
if (existing > 0 && !process.argv.includes('--reset')) { console.log(`Seed skipped: ${existing} tenant(s) already exist at ${resolveDbPath()}`); process.exit(0); }

const random = rng(Number(process.env.CSER_SEED || 20260729));
const tenants = [
  ['ten-northstar','northstar','Northstar Industrial Systems'],
  ['ten-bluepeak','bluepeak','BluePeak Logistics']
];
const users = [
  ['usr-sofia','sofia.marin@northstar.demo','Sofia Marin'],
  ['usr-lukas','lukas.novak@northstar.demo','Lukas Novak'],
  ['usr-petra','petra.horak@northstar.demo','Petra Horak'],
  ['usr-martin','martin.sykora@northstar.demo','Martin Sykora'],
  ['usr-alex','alex.reed@northstar.demo','Alex Reed'],
  ['usr-nina','nina.carter@bluepeak.demo','Nina Carter'],
  ['usr-omar','omar.hassan@bluepeak.demo','Omar Hassan']
];
const memberships = [
  ['mem-sofia','ten-northstar','usr-sofia','SECURITY_ANALYST'],
  ['mem-lukas','ten-northstar','usr-lukas','CLOUD_OPERATIONS'],
  ['mem-petra','ten-northstar','usr-petra','SECURITY_MANAGER'],
  ['mem-martin','ten-northstar','usr-martin','READ_ONLY_AUDITOR'],
  ['mem-alex','ten-northstar','usr-alex','PLATFORM_ADMIN'],
  ['mem-nina','ten-bluepeak','usr-nina','SECURITY_ANALYST'],
  ['mem-omar','ten-bluepeak','usr-omar','CLOUD_OPERATIONS']
];
const connections = [
  ['con-az-ns','ten-northstar','AZURE','Northstar Azure Production','sub-ns-prod','HEALTHY','FRESH','HEALTHY',4120],
  ['con-aws-ns','ten-northstar','AWS','Northstar AWS Core','acc-984201','DEGRADED','STALE','SLOW',3520],
  ['con-gcp-ns','ten-northstar','GCP','Northstar GCP Data','prj-northstar-data','HEALTHY','FRESH','HEALTHY',2360],
  ['con-az-ns-dev','ten-northstar','AZURE','Azure Engineering','sub-ns-eng','HEALTHY','FRESH','HEALTHY',860],
  ['con-aws-ns-lab','ten-northstar','AWS','AWS Security Lab','acc-223109','RATE_LIMITED','STALE','RATE_LIMITED',410],
  ['con-gcp-ns-lab','ten-northstar','GCP','GCP Sandbox','prj-ns-sandbox','AUTH_ERROR','STALE','AUTH_ERROR',210],
  ['con-az-bp','ten-bluepeak','AZURE','BluePeak Azure','sub-bp-main','HEALTHY','FRESH','HEALTHY',330],
  ['con-aws-bp','ten-bluepeak','AWS','BluePeak AWS','acc-775502','HEALTHY','FRESH','HEALTHY',260],
  ['con-gcp-bp','ten-bluepeak','GCP','BluePeak GCP','prj-bluepeak','OFFLINE','STALE','OFFLINE',110]
];
const rules = [
  ['DEMO.PUBLIC_MANAGEMENT_ENDPOINT','Public management endpoint on production workload'],
  ['DEMO.STORAGE_ENCRYPTION_DISABLED','Storage encryption is disabled'],
  ['DEMO.EXCESSIVE_IAM_PERMISSION','Overly permissive cloud identity role'],
  ['DEMO.PROTECTION_NOT_ACTIVE','Workload protection is not active'],
  ['DEMO.SECURITY_LOGGING_DISABLED','Security logging is not enabled'],
  ['DEMO.STALE_INVENTORY','Workload inventory data is stale'],
  ['DEMO.MISSING_OWNER','Cloud workload has no accountable owner'],
  ['DEMO.OVERLY_BROAD_NETWORK_SOURCE','Network rule allows an overly broad source'],
  ['DEMO.BACKUP_POLICY_ABSENT','Backup policy is not assigned'],
  ['DEMO.UNSUPPORTED_OS','Operating system version is unsupported']
];
const regions = { AZURE:['westeurope','northeurope','eastus','centralus'], AWS:['eu-central-1','eu-west-1','us-east-1','us-west-2'], GCP:['europe-west1','europe-west3','us-central1','asia-east1'] };
const owners = ['Platform API Team','Identity Engineering','Data Platform','Cloud Operations','Finance Applications','Customer Portal'];
const osValues = [['LINUX','Ubuntu 24.04'],['LINUX','RHEL 9'],['WINDOWS','Windows Server 2022'],['LINUX','Debian 12']];
const environments = [['PRODUCTION',.35],['STAGING',.25],['DEVELOPMENT',.30],['SANDBOX',.10]];
const protections = [['PROTECTED',.72],['UNPROTECTED',.18],['PENDING',.05],['UNSUPPORTED',.05]];
const severities = [['CRITICAL',.03],['HIGH',.17],['MEDIUM',.45],['LOW',.35]];
const statuses = [['OPEN',.18],['TRIAGED',.15],['ASSIGNED',.14],['IN_PROGRESS',.16],['READY_FOR_REVIEW',.08],['VERIFIED',.05],['RESOLVED',.16],['DEFERRED',.04],['ACCEPTED_RISK',.04]];
function score(severity, production, internet, unprotected, criticality, overdue) { const base = {CRITICAL:45,HIGH:32,MEDIUM:18,LOW:8}[severity] || 0; return Math.min(100, base + 12 + (production?10:0) + (internet?12:0) + (unprotected?10:0) + (criticality==='CRITICAL'?8:0) + (overdue?8:0)); }

const q = {
  tenant: db.prepare('INSERT INTO tenants VALUES (?,?,?,?,?,?,?)'),
  user: db.prepare('INSERT INTO users VALUES (?,?,?,?,?,?)'),
  membership: db.prepare('INSERT INTO memberships VALUES (?,?,?,?,?,?,?)'),
  connection: db.prepare(`INSERT INTO cloud_connections (id,tenant_id,provider,alias,external_scope_id,status,freshness_status,last_sync_at,last_successful_sync_at,circuit_state,mode,object_count,error_code,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  workload: db.prepare(`INSERT INTO workloads (id,tenant_id,connection_id,provider,external_id,name,scope_alias,environment,region,os_family,os_version,eligibility,protection_status,asset_criticality,internet_exposure,owner_user_id,owner_team,tags_json,risk_score,finding_count,highest_severity,last_seen_at,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  finding: db.prepare(`INSERT INTO findings (id,tenant_id,workload_id,rule_key,title,description,severity,confidence,status,risk_score,risk_explanation_json,assignee_user_id,assignee_team,due_at,first_seen_at,last_seen_at,resolved_at,accepted_until,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  task: db.prepare(`INSERT INTO remediation_tasks (id,tenant_id,finding_id,owner_user_id,owner_team,state,summary,checklist_json,due_at,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`),
  evidence: db.prepare(`INSERT INTO evidence (id,tenant_id,finding_id,task_id,uploaded_by_user_id,type,status,original_name,mime_type,size,sha256,structured_note,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  verification: db.prepare('INSERT INTO verifications VALUES (?,?,?,?,?,?,?,?)'),
  acceptance: db.prepare('INSERT INTO risk_acceptances VALUES (?,?,?,?,?,?,?,?,?)'),
  comment: db.prepare('INSERT INTO comments VALUES (?,?,?,?,?,?)'),
  plan: db.prepare(`INSERT INTO enablement_plans (id,tenant_id,connection_id,created_by_user_id,state,scope_json,targets_json,exclusions_json,auto_enable_new,auto_enable_existing,preview_json,validated_at,progress,result_json,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`),
  assumption: db.prepare(`INSERT INTO impact_assumptions (id,tenant_id,name,scenario,values_json,created_by_user_id,version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)`),
  notification: db.prepare('INSERT INTO notifications VALUES (?,?,?,?,?,?,?,?)'),
  audit: db.prepare(`INSERT INTO audit_events (id,tenant_id,actor_user_id,actor_role,action,entity_type,entity_id,before_hash,after_hash,safe_diff_json,reason,correlation_id,request_id,idempotency_key,ip_address,user_agent,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
};

console.log('Seeding CSER Workspace V2 database...');
db.exec('BEGIN IMMEDIATE');
try {
  for (const [tenantId,key,name] of tenants) q.tenant.run(tenantId,key,name,'ACTIVE','{}',iso(-2000),iso());
  for (const [userId,email,name] of users) q.user.run(userId,email,name,'ACTIVE',iso(-2000),iso());
  for (const [membershipId,tenantId,userId,role] of memberships) q.membership.run(membershipId,tenantId,userId,role,'ACTIVE',iso(-2000),iso());
  for (const [connectionId,tenantId,provider,alias,scope,status,freshness,mode,count] of connections) {
    const errorCode = status === 'AUTH_ERROR' ? 'PROVIDER_PERMISSION_DENIED' : status === 'RATE_LIMITED' ? 'PROVIDER_RATE_LIMITED' : status === 'OFFLINE' ? 'PROVIDER_UNAVAILABLE' : null;
    q.connection.run(connectionId,tenantId,provider,alias,scope,status,freshness,iso(-2),status==='HEALTHY'?iso(-2):iso(-28),status==='OFFLINE'?'OPEN':'CLOSED',mode,count,errorCode,1,iso(-2000),iso());
  }

  const northstarConnections = connections.filter(connection => connection[1] === 'ten-northstar');
  const bluepeakConnections = connections.filter(connection => connection[1] === 'ten-bluepeak');
  for (let index = 1; index <= 10_000; index += 1) {
    const tenantId = index <= 9400 ? 'ten-northstar' : 'ten-bluepeak';
    const connection = index === 7 ? northstarConnections.find(item => item[0] === 'con-az-ns') : choose(random, tenantId === 'ten-northstar' ? northstarConnections : bluepeakConnections);
    const provider = connection[2]; const environment = index === 7 ? 'PRODUCTION' : weighted(random, environments); const protection = index === 7 ? 'UNPROTECTED' : weighted(random, protections);
    const criticality = weighted(random, [['CRITICAL',.12],['HIGH',.28],['MEDIUM',.42],['LOW',.18]]); const internet = random() < (environment === 'PRODUCTION' ? .22 : .09);
    const os = choose(random, osValues); const ownerTeam = choose(random, owners); const ownerUser = tenantId === 'ten-northstar' ? (random() < .45 ? 'usr-lukas' : null) : (random() < .45 ? 'usr-omar' : null);
    const workloadId = index === 7 ? 'WLD-AZ-PROD-0007' : id('wld', index);
    const workloadName = index === 7 ? 'azure-prod-api-07' : `${provider.toLowerCase()}-${environment.toLowerCase()}-${choose(random,['api','worker','db','gateway','etl','portal'])}-${String(index).padStart(4,'0')}`;
    const external = `${provider.toLowerCase()}-${String(index).padStart(6,'0')}`;
    const baseRisk = Math.floor(random() * 54) + (protection === 'UNPROTECTED' ? 25 : 0) + (internet ? 12 : 0) + (criticality === 'CRITICAL' ? 8 : 0);
    q.workload.run(workloadId,tenantId,connection[0],provider,external,workloadName,connection[3],environment,index === 7 ? 'westeurope' : choose(random,regions[provider]),os[0],os[1],protection==='UNSUPPORTED'?'INELIGIBLE':'ELIGIBLE',protection,criticality,internet?1:0,ownerUser,ownerTeam,JSON.stringify([environment.toLowerCase(),provider.toLowerCase(),index%3===0?'customer-facing':'internal']),Math.min(100,baseRisk),0,'NONE',iso(-Math.floor(random()*48)),1,iso(-2000),iso(-Math.floor(random()*24)));
  }

  const findingIds = [];
  for (let index = 1; index <= 2500; index += 1) {
    const workloadIndex = index === 1 ? 7 : 1 + Math.floor(random() * 10_000);
    const workloadId = index === 1 ? 'WLD-AZ-PROD-0007' : id('wld', workloadIndex);
    const workload = db.prepare('SELECT * FROM workloads WHERE id=?').get(workloadId); if (!workload) continue;
    const severity = index === 1 ? 'CRITICAL' : weighted(random, severities);
    const status = index === 1 ? 'OPEN' : weighted(random, statuses);
    const overdue = random() < .18; const rule = index === 1 ? rules[0] : choose(random, rules);
    const findingId = index === 1 ? 'FND-CRIT-0042' : id('fnd', index);
    const risk = index === 1 ? 94 : score(severity,workload.environment==='PRODUCTION',!!workload.internet_exposure,workload.protection_status==='UNPROTECTED',workload.asset_criticality,overdue);
    const cloudOps = workload.tenant_id === 'ten-northstar' ? 'usr-lukas' : 'usr-omar'; const analyst = workload.tenant_id === 'ten-northstar' ? 'usr-sofia' : 'usr-nina';
    const hasTask = ['ASSIGNED','IN_PROGRESS','READY_FOR_REVIEW','VERIFIED','RESOLVED','DEFERRED'].includes(status);
    const assignee = hasTask ? cloudOps : null; const due = iso(overdue ? -24 * (1 + Math.floor(random()*8)) : 24 * (1 + Math.floor(random()*12)));
    const acceptedUntil = status === 'ACCEPTED_RISK' ? iso(24 * (10 + Math.floor(random()*45))) : null;
    q.finding.run(findingId,workload.tenant_id,workloadId,rule[0],rule[1],`Fictional normalized indicator for ${rule[1].toLowerCase()}. Review workload context and use the documented remediation workflow.`,severity,random()<.75?'HIGH':'MEDIUM',status,risk,JSON.stringify([{label:'Severity',points:{CRITICAL:45,HIGH:32,MEDIUM:18,LOW:8}[severity]},{label:'Environment and exposure',points:risk-({CRITICAL:45,HIGH:32,MEDIUM:18,LOW:8}[severity])}]),assignee,assignee?'Cloud Operations':null,due,iso(-24*(10+Math.floor(random()*70))),iso(-Math.floor(random()*24)),status==='RESOLVED'?iso(-Math.floor(random()*120)):null,acceptedUntil,1,iso(-2000),iso(-Math.floor(random()*24)));
    findingIds.push(findingId);

    if (hasTask) {
      const taskId = `tsk-${findingId}`;
      const taskState = status === 'ASSIGNED' ? 'TODO' : status === 'IN_PROGRESS' ? 'IN_PROGRESS' : status === 'READY_FOR_REVIEW' ? 'REVIEW_REQUESTED' : status === 'DEFERRED' ? 'BLOCKED' : 'DONE';
      const complete = ['READY_FOR_REVIEW','VERIFIED','RESOLVED'].includes(status);
      const checklist = [{id:`${taskId}-context`,label:'Review finding context',done:taskState!=='TODO'},{id:`${taskId}-change`,label:'Apply approved change',done:complete},{id:`${taskId}-evidence`,label:'Provide verification evidence',done:complete}];
      q.task.run(taskId,workload.tenant_id,findingId,cloudOps,'Cloud Operations',taskState,'Apply the documented fictional remediation and provide evidence.',JSON.stringify(checklist),due,1,iso(-120),iso(-5));
      if (complete) {
        q.evidence.run(`evd-${findingId}`,workload.tenant_id,findingId,taskId,cloudOps,'STRUCTURED_NOTE','CLEAN',null,null,null,hash(`evidence:${findingId}`),'The fictional provider configuration was updated and the approved access scope was verified by Cloud Operations.',iso(-4));
      }
      if (['VERIFIED','RESOLVED'].includes(status)) {
        q.verification.run(`ver-${findingId}`,workload.tenant_id,findingId,analyst,'CONTROL_RECHECK','PASSED','Independent control recheck passed in the deterministic demo scenario.',iso(-2));
      }
    }
    if (status === 'ACCEPTED_RISK') {
      const manager = workload.tenant_id === 'ten-northstar' ? 'usr-petra' : analyst;
      q.acceptance.run(`rac-${findingId}`,workload.tenant_id,findingId,manager,'Temporary acceptance while a replacement control is scheduled.','Cloud Platform Owner','Restricted network path and increased monitoring.',acceptedUntil,iso(-6));
    }
  }

  db.exec(`UPDATE workloads SET finding_count=(SELECT COUNT(*) FROM findings f WHERE f.workload_id=workloads.id), highest_severity=COALESCE((SELECT severity FROM findings f WHERE f.workload_id=workloads.id ORDER BY CASE severity WHEN 'CRITICAL' THEN 4 WHEN 'HIGH' THEN 3 WHEN 'MEDIUM' THEN 2 ELSE 1 END DESC LIMIT 1),'NONE'), risk_score=MAX(risk_score,COALESCE((SELECT MAX(risk_score) FROM findings f WHERE f.workload_id=workloads.id),0));`);
  q.comment.run('cmt-primary','ten-northstar','FND-CRIT-0042','usr-sofia','Prioritize this finding because the affected workload is production-facing.',iso(-1));

  const planPreview = {eligible:1,selected:1,excluded:0,warnings:[],estimatedMinutes:2};
  q.plan.run('pln-demo-ready','ten-northstar','con-az-ns','usr-sofia','READY',JSON.stringify({environment:'PRODUCTION',region:'westeurope'}),JSON.stringify(['WLD-AZ-PROD-0007']),JSON.stringify([]),1,1,JSON.stringify(planPreview),iso(-1),0,'{}',1,iso(-3),iso(-1));

  const scenarios = {
    CONSERVATIVE:{activeOrganizations:50,supportContactsPerOrg:12,deflectionRate:.10,averageContactHours:.75,loadedSupportHourValue:40,onboardingsPerYear:15,savedHoursPerOnboarding:4,technicalHourValue:55,qualifiedExpansionEvents:2,contributionPerExpansion:3000,retainedCustomers:0,annualContributionPerRetainedCustomer:8000,initialInvestment:120000,annualOperatingCost:36000},
    BASE:{activeOrganizations:150,supportContactsPerOrg:18,deflectionRate:.20,averageContactHours:.75,loadedSupportHourValue:40,onboardingsPerYear:40,savedHoursPerOnboarding:8,technicalHourValue:55,qualifiedExpansionEvents:8,contributionPerExpansion:5000,retainedCustomers:2,annualContributionPerRetainedCustomer:15000,initialInvestment:120000,annualOperatingCost:36000},
    GROWTH:{activeOrganizations:400,supportContactsPerOrg:24,deflectionRate:.30,averageContactHours:.75,loadedSupportHourValue:40,onboardingsPerYear:100,savedHoursPerOnboarding:12,technicalHourValue:55,qualifiedExpansionEvents:25,contributionPerExpansion:7000,retainedCustomers:6,annualContributionPerRetainedCustomer:20000,initialInvestment:120000,annualOperatingCost:36000}
  };
  let scenarioIndex = 1;
  for (const [scenario,values] of Object.entries(scenarios)) q.assumption.run(id('asm',scenarioIndex++),'ten-northstar',`${scenario[0]}${scenario.slice(1).toLowerCase()} scenario`,scenario,JSON.stringify(values),'usr-petra',1,iso(-10),iso(-10));
  for (const [scenario,values] of Object.entries(scenarios)) q.assumption.run(id('bpa',scenarioIndex++),'ten-bluepeak',`${scenario[0]}${scenario.slice(1).toLowerCase()} scenario`,scenario,JSON.stringify(values),'usr-nina',1,iso(-10),iso(-10));

  for (const row of [
    ['ntf-1','ten-northstar','usr-sofia','Critical finding requires triage','FND-CRIT-0042 is open on a production workload.','CRITICAL'],
    ['ntf-2','ten-northstar','usr-lukas','Remediation queue updated','Assigned fictional remediation work is ready.','INFO'],
    ['ntf-3','ten-northstar','usr-petra','AWS integration degraded','Latest successful sync is older than the freshness target.','WARNING'],
    ['ntf-4','ten-northstar','usr-alex','GCP permission error','Review the provider permission precheck.','WARNING'],
    ['ntf-5','ten-bluepeak','usr-nina','BluePeak GCP is offline','Cached data remains available with a freshness warning.','WARNING']
  ]) q.notification.run(row[0],row[1],row[2],row[3],row[4],row[5],null,iso(-1));

  for (let index = 1; index <= 520; index += 1) {
    const tenantId = index % 10 === 0 ? 'ten-bluepeak' : 'ten-northstar';
    const actor = tenantId === 'ten-northstar' ? choose(random,[['usr-sofia','SECURITY_ANALYST'],['usr-lukas','CLOUD_OPERATIONS'],['usr-petra','SECURITY_MANAGER'],['usr-alex','PLATFORM_ADMIN']]) : choose(random,[['usr-nina','SECURITY_ANALYST'],['usr-omar','CLOUD_OPERATIONS']]);
    const entity = choose(random,['FINDING','WORKLOAD','INTEGRATION','ENABLEMENT_PLAN','MEMBERSHIP']);
    const tenantFindings = findingIds.filter(findingId => db.prepare('SELECT tenant_id FROM findings WHERE id=?').get(findingId)?.tenant_id === tenantId);
    const entityId = entity === 'FINDING' ? choose(random,tenantFindings) : id(entity.toLowerCase(),index);
    q.audit.run(id('aud',index),tenantId,actor[0],actor[1],choose(random,['VIEWED','TRIAGED','ASSIGNED','TRANSITIONED','EXPORTED','SYNC_REQUESTED','PERMISSION_CHECKED']),entity,entityId,null,hash(index),JSON.stringify({demo:true}),null,id('cor',index),id('req',index),null,'127.0.0.1','CSER deterministic seed',iso(-index/4));
  }

  db.exec('COMMIT');
  console.log(`Seed complete: 10,000 workloads, ${findingIds.length} findings at ${resolveDbPath()}`);
} catch (error) { db.exec('ROLLBACK'); throw error; }
