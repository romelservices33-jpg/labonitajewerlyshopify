const fs = require('fs');
const path = require('path');

const filesToRemove = [
  path.join(__dirname, 'git_info.json'),
  path.join(__dirname, 'sync_report.json'),
  path.join(__dirname, 'size_report.txt'),
  path.join(__dirname, 'check_git.js')
];

filesToRemove.forEach(f => {
  if (fs.existsSync(f)) {
    console.log(`Removing ${f}`);
    fs.unlinkSync(f);
  }
});
console.log('CLEANUP COMPLETE');
