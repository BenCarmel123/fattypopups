module.exports = {
  apps: [
    {
      name: 'fattypopups',
      script: 'server.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'draft-worker',
      script: 'worker/draftConsumer.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
