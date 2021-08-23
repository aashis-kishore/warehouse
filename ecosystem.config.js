module.exports = {
  apps: [
    {
      name: 'warehouse',
      script: './dist/index.js',
      exec_mode: 'cluster',
      instances: 1,
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
      env_development: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      ignore_watch: ['node_modules'],
      watch_options: {
        followSymlinks: false
      }
    }
  ]
}
