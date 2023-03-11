#!/usr/bin/env node

import { program } from 'commander';
import * as actions from './src/actions.js';

program
  .option('-a, --api-key <OpenAI API key>', 'configure how to use your API key')
  .option('-c, --code <language>', 'generate code snippet instead of a command prompt')

program.parse();
const options = program.opts();
const prompt = program.args.join(' ');

// Set api key
if (options.apiKey) {
  actions.apiKey(options.apiKey);
  process.exit();
}

// Configure API
try {
  actions.setupClient()
} catch (err) {
  console.error(`Missing API Key. Add API key with

  how -a <OpenAI API Key> `)
  process.exit(1);
}

if (prompt === '') {
  program.outputHelp();
  process.exit(1);
}

// Execute actions
if (options.code) {
  try {
    await actions.code(options.code, prompt);
  } catch (err) {
    console.error(`Error: ${err}`)
    process.exit(1);
  }
  process.exit();
}

try {
  await actions.command(prompt);
} catch (err) {
  console.error(`Error: ${err}`)
  process.exit(1);
}
