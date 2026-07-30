'use strict';
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '..', 'public', 'app.js');
if (!fs.existsSync(file)) throw new Error('TypeScript output was not created.');
const banner = `/* CSER Workspace — independent candidate concept, fictional data. Built ${new Date().toISOString()} */\n`;
const content = fs.readFileSync(file, 'utf8');
if (!content.startsWith('/* CSER Workspace')) fs.writeFileSync(file, banner + content);
console.log(`Frontend build ready: ${Math.round(fs.statSync(file).size/1024)} KiB`);
