const { spawn } = require('child_process');
const fs = require('fs');

const logFile = './code/spawn_git.log';
fs.writeFileSync(logFile, 'Spawn git start...\n');

function run(cmd, args) {
  return new Promise((resolve) => {
    fs.appendFileSync(logFile, `RUN: ${cmd} ${args.join(' ')}\n`);
    const proc = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    
    proc.stdout.on('data', (d) => fs.appendFileSync(logFile, `STDOUT: ${d}\n`));
    proc.stderr.on('data', (d) => fs.appendFileSync(logFile, `STDERR: ${d}\n`));
    proc.on('close', (code) => {
      fs.appendFileSync(logFile, `EXIT: ${code}\n`);
      resolve(code);
    });
    proc.on('error', (err) => {
      fs.appendFileSync(logFile, `ERROR: ${err.message}\n`);
      resolve(-1);
    });
  });
}

(async () => {
  await run('git', ['status', '--short']);
  await run('git', ['add', '-A']);
  await run('git', ['commit', '-m', 'fix: restaurar tarjetas cutout de lujo con SVG y footer blanco scoped']);
  await run('git', ['push', 'origin', 'main']);
  fs.appendFileSync(logFile, 'ALL PROCESSES FINISHED.\n');
})();
