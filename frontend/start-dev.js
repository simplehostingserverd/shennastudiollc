#!/usr/bin/env node

import { spawn } from 'child_process'
import fs from 'fs'
// import path from 'path' // unused

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

// function log(message, color = colors.reset) {
//     console.log(`${color}${message}${colors.reset}`)
// }

function logSection(title) {
  console.log(`\n${colors.cyan}${colors.bold}🚀 ${title}${colors.reset}`)
  console.log('-'.repeat(50))
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`)
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`)
}

async function checkPrerequisites() {
  logSection('Checking Prerequisites')

  let allGood = true

  // Check Node.js version
  const nodeVersion = process.version
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1))

  if (majorVersion >= 18) {
    logSuccess(`Node.js version: ${nodeVersion}`)
  } else {
    logError(`Node.js version ${nodeVersion} is too old. Minimum required: v18`)
    allGood = false
  }

  // Check if dependencies are installed
  if (fs.existsSync('./node_modules')) {
    logSuccess('Frontend dependencies installed')
  } else {
    logError('Frontend dependencies not installed. Run "npm install" first')
    allGood = false
  }

  if (fs.existsSync('./ocean-backend/node_modules')) {
    logSuccess('Backend dependencies installed')
  } else {
    logError(
      'Backend dependencies not installed. Run "cd ocean-backend && npm install" first'
    )
    allGood = false
  }

  // Check for environment files
  if (fs.existsSync('.env')) {
    logInfo('Frontend .env file found')
  } else {
    logInfo('Frontend .env file not found (optional)')
  }

  if (fs.existsSync('./ocean-backend/.env')) {
    logInfo('Backend .env file found')
  } else {
    logInfo('Backend .env file not found (will need database for backend)')
  }

  return allGood
}

function startFrontend(useTurbopack = false) {
  const mode = useTurbopack ? 'dev:turbo' : 'dev'
  logInfo(
    `Starting Next.js frontend ${useTurbopack ? '(with Turbopack)' : '(standard mode)'}...`
  )

  const frontend = spawn('npm', ['run', mode], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  let frontendStarted = false

  frontend.stdout.on('data', (data) => {
    const output = data.toString()

    if (output.includes('Ready')) {
      if (!frontendStarted) {
        logSuccess('Frontend started successfully! 🎉')
        logInfo('  📱 Local: http://localhost:3000')
        frontendStarted = true
      }
    }

    // Filter out noise but show important messages
    if (
      output.includes('Error') ||
      output.includes('Warning') ||
      output.includes('Ready') ||
      output.includes('Local:')
    ) {
      process.stdout.write(`${colors.blue}[Frontend]${colors.reset} ${output}`)
    }
  })

  frontend.stderr.on('data', (data) => {
    const output = data.toString()
    if (!output.includes('Attention: Next.js now collects')) {
      process.stderr.write(
        `${colors.yellow}[Frontend Warning]${colors.reset} ${output}`
      )
    }
  })

  frontend.on('error', (err) => {
    logError(`Frontend failed to start: ${err.message}`)
  })

  return frontend
}

function startBackend() {
  logInfo('Starting Medusa backend...')

  const backend = spawn('npm', ['run', 'dev'], {
    cwd: './ocean-backend',
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  })

  let backendStarted = false

  backend.stdout.on('data', (data) => {
    const output = data.toString()

    if (output.includes('Server is ready')) {
      if (!backendStarted) {
        logSuccess('Backend started successfully! 🌊')
        logInfo('  🛠️  API: http://localhost:9000')
        logInfo('  👤 Admin: http://localhost:7001')
        backendStarted = true
      }
    }

    // Show backend output with prefix
    if (output.trim()) {
      process.stdout.write(
        `${colors.magenta}[Backend]${colors.reset} ${output}`
      )
    }
  })

  backend.stderr.on('data', (data) => {
    const output = data.toString()
    process.stderr.write(
      `${colors.red}[Backend Error]${colors.reset} ${output}`
    )
  })

  backend.on('error', (err) => {
    logError(`Backend failed to start: ${err.message}`)
  })

  return backend
}

async function main() {
  console.log(`${colors.cyan}${colors.bold}`)
  console.log("🌊 SHENNA'S STUDIO - DEVELOPMENT SERVER")
  console.log('=====================================')
  console.log(`${colors.reset}\n`)

  // Check prerequisites
  const prerequisitesOk = await checkPrerequisites()

  if (!prerequisitesOk) {
    logError(
      'Prerequisites check failed. Please fix the issues above and try again.'
    )
    process.exit(1)
  }

  logSection('Starting Development Servers')

  // Start both servers
  const processes = []

  try {
    // Check if we should use Turbopack (pass --turbo flag)
    const useTurbopack = process.argv.includes('--turbo')

    // Start frontend
    const frontend = startFrontend(useTurbopack)
    processes.push(frontend)

    // Wait a moment, then start backend
    setTimeout(() => {
      const backend = startBackend()
      processes.push(backend)
    }, 2000)

    // Handle graceful shutdown
    const shutdown = () => {
      logSection('Shutting down servers')
      processes.forEach((proc) => {
        if (proc && !proc.killed) {
          proc.kill('SIGTERM')
        }
      })
      setTimeout(() => {
        process.exit(0)
      }, 2000)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    // Keep the process alive
    const keepAlive = setInterval(() => {
      // Check if processes are still running
      const activeProcesses = processes.filter((proc) => proc && !proc.killed)
      if (activeProcesses.length === 0) {
        logError('All processes have stopped')
        clearInterval(keepAlive)
        process.exit(1)
      }
    }, 5000)

    // Show helpful information
    setTimeout(() => {
      logSection('Development Environment Ready')
      logSuccess('Both frontend and backend should be starting...')
      logInfo('📱 Frontend: http://localhost:3000')
      logInfo('🛠️  Backend API: http://localhost:9000')
      logInfo('👤 Admin Panel: http://localhost:7001')
      logInfo('\n💡 Tips:')
      logInfo('  • Make sure you have a database running for the backend')
      logInfo('  • Check .env files for configuration')
      logInfo('  • Press Ctrl+C to stop all servers')
    }, 5000)
  } catch (error) {
    logError(`Failed to start servers: ${error.message}`)
    process.exit(1)
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled Rejection at: ${promise}, reason: ${reason}`)
})

process.on('uncaughtException', (error) => {
  logError(`Uncaught Exception: ${error.message}`)
  process.exit(1)
})

// Check if this is the main module (ES6 modules don't have require.main)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
