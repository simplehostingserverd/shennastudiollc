module.exports = {
  apps: [
    {
      name: 'medusa-backend',
      cwd: '/app',
      script: 'medusa',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 9000,
        NODE_OPTIONS: '--experimental-vm-modules',
      },
      error_file: '/app/logs/backend-error.log',
      out_file: '/app/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
}