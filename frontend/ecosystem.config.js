// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
const rootDir = process.env.RAILWAY_DEPLOYMENT ? process.cwd() : '/app';

module.exports = {
  apps: [
    {
      name: 'shennastudio-backend',
      cwd: path.join(rootDir, 'ocean-backend'),
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.BACKEND_PORT || 9000,
      },
      error_file: path.join(rootDir, 'logs/backend-error.log'),
      out_file: path.join(rootDir, 'logs/backend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
    {
      name: 'shennastudio-frontend',
      cwd: rootDir,
      script: 'node',
      args: '.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: 1,
      },
      error_file: path.join(rootDir, 'logs/frontend-error.log'),
      out_file: path.join(rootDir, 'logs/frontend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
    },
  ],
}