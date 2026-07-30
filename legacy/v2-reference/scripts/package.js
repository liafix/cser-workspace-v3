'use strict';
const fs=require('node:fs');const path=require('node:path');const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');const out=path.resolve(root,'..','CSER_Workspace_Candidate_MVP_V2_FINAL.zip');
try{fs.unlinkSync(out)}catch{}
execFileSync('zip',['-qr',out,'.','-x','data/*.db-wal','data/*.db-shm','.git/*','*.log','test-results/*','playwright-report/*'],{cwd:root,stdio:'inherit'});
console.log(out);
