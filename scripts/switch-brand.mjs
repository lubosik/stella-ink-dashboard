#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const brandName = process.argv[2];

if (!brandName) {
  console.error('Usage: npm run switch-brand <brand-name>');
  console.error('Example: npm run switch-brand client-brand');
  process.exit(1);
}

const brandFile = path.join(process.cwd(), 'tokens', `${brandName}.json`);
const activeBrandFile = path.join(process.cwd(), 'tokens', 'active-brand.json');

async function switchBrand() {
  try {
    // Check if brand file exists
    await fs.access(brandFile);
    
    // Copy brand file to active-brand.json
    const brandContent = await fs.readFile(brandFile, 'utf-8');
    await fs.writeFile(activeBrandFile, brandContent);
    
    console.log(`✅ Switched to brand: ${brandName}`);
    console.log(`📁 Active brand: ${activeBrandFile}`);
    
    // Rebuild Tailwind CSS
    console.log('🔄 Rebuilding Tailwind CSS...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('✅ Brand switch complete!');
    
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Brand file not found: ${brandFile}`);
      console.error('Available brand files:');
      const tokensDir = path.join(process.cwd(), 'tokens');
      const files = await fs.readdir(tokensDir);
      const brandFiles = files.filter(f => f.endsWith('.json') && f !== 'active-brand.json');
      brandFiles.forEach(f => console.error(`  - ${f.replace('.json', '')}`));
    } else {
      console.error('❌ Error switching brand:', error.message);
    }
    process.exit(1);
  }
}

switchBrand();
