// scripts/check-dist.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function safeRun(cmd) {
  try { return execSync(cmd, { stdio: 'pipe' }).toString(); }
  catch (e) { return `ERROR running "${cmd}": ${e.message}`; }
}

console.log('=== runtime cwd ===');
console.log(process.cwd());

console.log('=== node version ===');
console.log(process.version);

console.log('=== list /app (top) ===');
console.log(safeRun('ls -la /app || dir /app'));

console.log('=== list /app/dist (recursive) ===');
console.log(safeRun('ls -laR /app/dist || dir /app\\dist'));

console.log('=== list ./dist (recursive) ===');
console.log(safeRun('ls -laR ./dist || dir .\\dist'));

console.log('=== which tsc / tsc version ===');
console.log(safeRun('which tsc || where tsc || echo "which not available"'));
console.log(safeRun('tsc -v || echo "tsc -v failed"'));

const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  try {
    const cfg = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('=== tsconfig.json outDir ===');
    console.log(cfg.compilerOptions && cfg.compilerOptions.outDir ? cfg.compilerOptions.outDir : '(no outDir)');
  } catch (e) {
    console.log('=== tsconfig.json parse error ===', e.message);
  }
} else {
  console.log('tsconfig.json not found at', tsconfigPath);
}

const expected = path.join(process.cwd(), 'dist', 'excelApi', 'index.js');
console.log('=== expected entry ===', expected);
console.log('exists?', fs.existsSync(expected));
if (fs.existsSync(expected)) {
  console.log('--- file stat ---', fs.statSync(expected));
}
