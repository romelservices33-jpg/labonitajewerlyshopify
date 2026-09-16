const { execSync } = require('child_process');
const fs = require('fs');

const result = {
  status: '',
  commit: '',
  push: '',
  error: null
};

try {
  result.status = execSync('git status --porcelain', { encoding: 'utf8' });
  console.log('Status before add:\n', result.status);

  execSync('git add -A', { encoding: 'utf8' });

  try {
    result.commit = execSync('git commit -m "fix: restaurar tarjetas cutout de lujo con SVG y footer blanco scoped"', { encoding: 'utf8' });
    console.log('Commit:\n', result.commit);
  } catch (e) {
    result.commit = 'Nothing new to commit or already committed: ' + (e.stdout || e.message);
  }

  const pushOutput = execSync('git push origin main', { encoding: 'utf8' });
  result.push = pushOutput;
  console.log('Push:\n', pushOutput);

  fs.writeFileSync('./code/git_push_status.json', JSON.stringify(result, null, 2), 'utf8');
} catch (err) {
  result.error = err.message;
  if (err.stderr) result.error += '\n' + err.stderr.toString();
  if (err.stdout) result.error += '\n' + err.stdout.toString();
  console.error('Git operation error:', result.error);
  fs.writeFileSync('./code/git_push_status.json', JSON.stringify(result, null, 2), 'utf8');
}
