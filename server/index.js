const { spawn } = require('child_process');
const path = require('path');

const tsxPath = path.join(__dirname, 'node_modules', '.bin', 'tsx');
const scriptPath = path.join(__dirname, 'src', 'index.ts');

const child = spawn(tsxPath, ['watch', scriptPath], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to launch tsx watch process:', err);
});
