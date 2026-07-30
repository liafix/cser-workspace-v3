'use strict';
const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = 4199;
const child = spawn(process.execPath, ['server/index.js'], { cwd: root, env: { ...process.env, PORT:String(port), HOST:'127.0.0.1' }, stdio:['ignore','pipe','pipe'] });
const wait = ms => new Promise(r=>setTimeout(r,ms));
async function run() {
  try {
    for (let i=0;i<40;i++) {
      try { const r=await fetch(`http://127.0.0.1:${port}/api/demo/identities`); if(r.ok) break; } catch {}
      await wait(100);
    }
    const landing=await fetch(`http://127.0.0.1:${port}/`); if(!landing.ok)throw new Error('Landing page failed');
    const app=await fetch(`http://127.0.0.1:${port}/app`); if(!app.ok)throw new Error('Application page failed');
    const identities=await (await fetch(`http://127.0.0.1:${port}/api/demo/identities`)).json();
    if(identities.identities.length<6)throw new Error('Demo identities missing');
    let cookie='';
    const login=await fetch(`http://127.0.0.1:${port}/api/demo/switch-identity`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({userId:'usr-sofia',tenantId:'ten-northstar'})});
    if(!login.ok)throw new Error('Demo login failed');
    cookie=login.headers.get('set-cookie').split(';')[0];
    const meRes=await fetch(`http://127.0.0.1:${port}/api/me`,{headers:{cookie}}); const me=await meRes.json(); if(me.role!=='SECURITY_ANALYST')throw new Error('Unexpected role');
    const overview=await (await fetch(`http://127.0.0.1:${port}/api/overview`,{headers:{cookie}})).json(); if(overview.totals.total<9000)throw new Error('Seed workload count too low');
    const findings=await (await fetch(`http://127.0.0.1:${port}/api/findings?severity=CRITICAL&limit=10`,{headers:{cookie}})).json(); if(!findings.items.length)throw new Error('Critical findings missing');
    console.log('Smoke test passed: landing, app, authentication, overview, and findings API.');
  } finally { child.kill('SIGTERM'); }
}
run().catch(e=>{console.error(e);child.kill('SIGTERM');process.exit(1)});
