module.exports = {
  apps: [
    {
      name: 'audiora',
      cwd: '/home/user/webapp/server',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    }
  ]
};
