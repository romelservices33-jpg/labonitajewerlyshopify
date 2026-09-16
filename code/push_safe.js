const { execSync } = require('child_process');
const fs = require('fs');

const env = Object.assign({}, process.env, {
  GIT_TERMINAL_PROMPT: '0',
  GCM_INTERACTIVE: 'never'
});

try {
  console.log('Staging files...');
  execSync('git add -A', { env, stdio: 'inherit' });
  
  console.log('Committing files...');
  try {
    execSync('git commit -m "fix: restaurar formas exactas de cutout cards, esquinas SVG, footer de lujo y productos reales"', { env, stdio: 'inherit' });
  } catch(e) {
    console.log('Commit note:', e.message);
  }

  console.log('Pushing to GitHub...');
  const res = execSync('git push -c credential.helper= origin main', { env, encoding: 'utf8' });
  console.log('PUSH SUCCESS:', res);
  fs.writeFileSync('./code/push_status.json', JSON.stringify({ success: true, log: res }));
} catch (err) {
  console.error('PUSH FAILED:', err.message);
  fs.writeFileSync('./code/push_status.json', JSON.stringify({ success: false, error: err.message, stderr: err.stderr ? err.stderr.toString() : '' }));
}
