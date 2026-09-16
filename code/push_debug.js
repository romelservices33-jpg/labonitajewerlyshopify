const { exec } = require('child_process');
const fs = require('fs');

const logFile = './code/push_debug.log';
function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}

fs.writeFileSync(logFile, 'Starting push debug...\n');

log('Running git status...');
exec('git status --short', (err, stdout, stderr) => {
  if (err) log('git status err: ' + err.message);
  log('git status stdout:\n' + stdout);

  log('Running git add -A...');
  exec('git add -A', (err, stdout, stderr) => {
    if (err) log('git add err: ' + err.message);
    log('git add done.');

    log('Running git commit...');
    exec('git commit -m "fix: restaurar formas exactas de cutout cards, esquinas SVG, footer de lujo y productos reales"', (err, stdout, stderr) => {
      if (err) log('git commit note: ' + err.message + ' stdout: ' + stdout);
      else log('git commit stdout:\n' + stdout);

      log('Running git push...');
      exec('git push origin main', (err, stdout, stderr) => {
        if (err) {
          log('git push ERROR: ' + err.message);
          log('git push STDERR: ' + stderr);
        } else {
          log('git push SUCCESS:\n' + stdout + '\n' + stderr);
        }
      });
    });
  });
});
