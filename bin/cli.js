#!/usr/bin/env node

const { startServer } = require('../src/server');

const args = process.argv.slice(2);
const portStart = args.indexOf('--port');
const port = portStart !== -1 ? parseInt(args[portStart + 1]) : 5000;

startServer(port);
