const fs = require('fs');
const path = require('path');
const entry = path.join(__dirname, '..', 'dist', 'excelApi', 'index.js');
if (!fs.existsSync(entry)) {
  console.error(`ERROR: build artifact not found: ${entry}`);
  console.error('Make sure "npm run build" runs during install or set NPM_CONFIG_PRODUCTION=false in your build environment.');
  process.exit(1);
}
console.log('dist exists, continuing...');
