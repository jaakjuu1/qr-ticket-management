require('dotenv').config({ path: './.env' });
const { exec } = require('child_process');

exec('set PORT=3333 && set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});