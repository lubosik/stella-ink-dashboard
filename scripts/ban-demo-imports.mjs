#!/usr/bin/env node

/**
 * CI Guard: Ban Demo & Legacy Imports
 * 
 * Fails the build if any file imports from:
 * - /legacy/calculator/*
 * - Direct step imports (Step1.tsx, Step2.tsx, etc.)
 * - Contains alert("Demo") or console.log("DEMO")
 * 
 * Usage:
 *   node scripts/ban-demo-imports.mjs
 * 
 * Add to package.json:
 *   "precommit": "node scripts/ban-demo-imports.mjs"
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Forbidden patterns
const FORBIDDEN_PATTERNS = [
  // Legacy imports
  { pattern: /from\s+['"].*\/legacy\/calculator/g, error: 'Import from /legacy/calculator/* is forbidden. Use @/components/calculator instead.' },
  { pattern: /from\s+['"].*\/calculator\/Step[1-7]\.tsx?['"]/g, error: 'Direct step import is forbidden. Use InstantQuote from @/components/calculator instead.' },
  { pattern: /from\s+['"].*\/calculator\/Step[1-7]['"]/g, error: 'Direct step import is forbidden. Use InstantQuote from @/components/calculator instead.' },
  
  // Demo code
  { pattern: /alert\s*\(\s*['"].*demo/gi, error: 'alert("Demo...") found - remove demo code before committing.' },
  { pattern: /console\.log\s*\(\s*['"].*DEMO/gi, error: 'console.log("DEMO...") found - remove demo code before committing.' },
  
  // HTML demo references
  { pattern: /instant-quote-demo\.html/g, error: 'Reference to instant-quote-demo.html found. Use instant-quote.html instead.' },
];

// File extensions to check
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.html', '.md'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', 'legacy', 'outputs'];

let violations = [];
let filesScanned = 0;

function scanDirectory(dir) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = item.substring(item.lastIndexOf('.'));
      if (EXTENSIONS.includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

function scanFile(filePath) {
  filesScanned++;
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(rootDir, filePath);

  for (const { pattern, error } of FORBIDDEN_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      violations.push({
        file: relativePath,
        error: error,
        matches: matches.slice(0, 3) // Show first 3 matches
      });
    }
  }
}

// Run scan
console.log('🔍 Scanning for forbidden imports and demo code...\n');
scanDirectory(rootDir);

// Report results
console.log(`📊 Scanned ${filesScanned} files\n`);

if (violations.length === 0) {
  console.log('✅ No violations found - build can proceed\n');
  process.exit(0);
} else {
  console.error(`❌ Found ${violations.length} violation(s):\n`);
  
  violations.forEach((v, i) => {
    console.error(`${i + 1}. ${v.file}`);
    console.error(`   ${v.error}`);
    console.error(`   Matches: ${v.matches.join(', ')}\n`);
  });

  console.error('Fix these violations before committing.\n');
  console.error('See /outputs/calculator/component-inventory.md for approved imports.\n');
  
  process.exit(1);
}
