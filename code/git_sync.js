const { execSync } = require('child_process');
const fs = require('fs');

try {
  const status = execSync('git status --short', { encoding: 'utf8' });
  console.log('Status before add:\n', status);

  execSync('git add -A', { encoding: 'utf8' });
  
  let commitMsg = 'fix: restaurar formas exactas de cutout cards, esquinas SVG, footer de lujo y productos reales';
  try {
    const commitRes = execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8' });
    console.log('Commit:\n', commitRes);
  } catch (ce) {
    console.log('Commit skipped/failed (maybe nothing to commit):', ce.stdout || ce.message);
  }

  const pushRes = execSync('git push origin main', { encoding: 'utf8' });
  console.log('Push:\n', pushRes);

  fs.writeFileSync('./code/git_sync_result.txt', 'SUCCESS\n' + pushRes, 'utf8');
} catch (err) {
  console.error('ERROR in git sync:', err.message);
  if (err.stdout) console.error('STDOUT:', err.stdout.toString());
  if (err.stderr) console.error('STDERR:', err.stderr.toString());
  fs.writeFileSync('./code/git_sync_result.txt', 'ERROR\n' + (err.stderr ? err.stderr.toString() : err.message), 'utf8');
}
