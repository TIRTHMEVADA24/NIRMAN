import { spawn } from 'node:child_process';
import process from 'node:process';

console.log('\x1b[36m%s\x1b[0m', '================================================');
console.log('\x1b[36m%s\x1b[0m', '  🚀 Starting Nirmaan Full-Stack Services...     ');
console.log('\x1b[36m%s\x1b[0m', '  Backend:  http://localhost:5000/api/health     ');
console.log('\x1b[36m%s\x1b[0m', '  Frontend: http://localhost:8443                ');
console.log('\x1b[36m%s\x1b[0m', '================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: './backend',
  stdio: 'pipe',
  shell: true,
});

const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: './frontend',
  stdio: 'pipe',
  shell: true,
});

function pipeOutput(child, prefix, color) {
  const reset = '\x1b[0m';
  child.stdout?.on('data', (data) => {
    process.stdout.write(`${color}[${prefix}]${reset} ${data}`);
  });
  child.stderr?.on('data', (data) => {
    process.stderr.write(`${color}[${prefix} ERR]${reset} ${data}`);
  });
}

pipeOutput(backend, 'BACKEND', '\x1b[34m');
pipeOutput(frontend, 'FRONTEND', '\x1b[32m');

const cleanup = () => {
  console.log('\n🛑 Shutting down Nirmaan services...');
  try {
    backend.kill();
  } catch {}
  try {
    frontend.kill();
  } catch {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
