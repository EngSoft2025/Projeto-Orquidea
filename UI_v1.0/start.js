
// Script compatível com versões mais antigas do Node.js
const { spawn } = require('child_process');
const path = require('path');

const viteBin = path.resolve(__dirname, 'node_modules', '.bin', 'vite');

// Inicia o processo Vite
const child = spawn(viteBin, [], {
  stdio: 'inherit',
  shell: true
});

// Manipulação de encerramento
child.on('close', (code) => {
  process.exit(code);
});

// Encaminhar sinais para o processo filho
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
