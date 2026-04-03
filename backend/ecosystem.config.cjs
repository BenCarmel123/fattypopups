const path = require('path');
const backendDir = path.join(__dirname);

module.exports = {
  apps: [
    {
      name: 'fattypopups',
      script: 'server.js',
      cwd: backendDir,
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'draft-worker',
      script: 'worker/draftConsumer.js',
      cwd: backendDir,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
