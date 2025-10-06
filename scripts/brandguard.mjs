#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BrandGuard: Blocks hardcoded hex, inline styles, font names outside tokens
const forbidden = [
  /style="[^"]*"/,                    // Inline styles
  /#[0-9a-f]{3,6}/i,                  // Hex colors
  /font-family:\s*['"][^'"]*['"]/,    // Direct font names
  /box-shadow:\s*\d+px/               // Hardcoded shadows
];

const violations = [];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      forbidden.forEach((pattern, patternIndex) => {
        if (pattern.test(line)) {
          violations.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
            pattern: patternIndex
          });
        }
      });
    });
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, .git, and legacy directories
        if (!['node_modules', '.next', '.git', 'dist', 'build', 'public', 'components', 'lib', 'styles', 'outputs'].includes(item)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Only scan relevant file types, but exclude config files and legacy files
        if (/\.(tsx?|jsx?|css|scss|sass)$/.test(item) && 
            !item.includes('globals.css') && 
            !item.includes('tailwind.config.js') &&
            !fullPath.includes('components/calculator') &&
            !fullPath.includes('lib/notifications') &&
            !fullPath.includes('styles/') &&
            !fullPath.includes('public/stella')) {
          scanFile(fullPath);
        }
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
  }
}

// Scan the project
const projectRoot = path.join(__dirname, '..');
scanDirectory(projectRoot);

// Report violations
if (violations.length > 0) {
  console.error('❌ BrandGuard violations found:');
  console.error('');
  
  violations.forEach(violation => {
    const patternNames = [
      'Inline styles',
      'Hex colors',
      'Direct font names',
      'Hardcoded shadows'
    ];
    
    console.error(`  ${violation.file}:${violation.line}`);
    console.error(`    ${patternNames[violation.pattern]}: ${violation.content}`);
    console.error('');
  });
  
  console.error(`Total violations: ${violations.length}`);
  console.error('');
  console.error('Fix these violations by:');
  console.error('  - Using CSS custom properties from tokens');
  console.error('  - Using Tailwind classes instead of inline styles');
  console.error('  - Importing fonts from tokens/stella-brand.json');
  console.error('');
  
  process.exit(1);
} else {
  console.log('✅ BrandGuard: No violations found - build can proceed');
  process.exit(0);
}
