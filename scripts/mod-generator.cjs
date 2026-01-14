#!/usr/bin/env node

const { spawn } = require('node:child_process')
const path = require('node:path')

function run(command, args, cwdLabel, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    windowsHide: true,
  })

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[${cwdLabel}] exited with code ${code}`)
    }
  })

  return child
}

const root = process.cwd()
const backendCwd = path.join(root, 'backend')
const frontendCwd = path.join(root, 'frontend')

// Use npm because both subprojects are npm-based.
const backend = run('npm', ['run', 'dev'], 'backend', backendCwd)
const frontend = run('npm', ['run', 'dev'], 'frontend', frontendCwd)

function shutdown(signal) {
  console.log(`\nShutting down (${signal})...`)
  backend.kill('SIGINT')
  frontend.kill('SIGINT')
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
