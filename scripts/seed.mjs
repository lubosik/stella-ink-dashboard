#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialState = {
  bookedAppointments: 0,
  valuePerBooking: 100,
  revenueAutopilot: 0,
  websiteClicks: 0,
  bookingRate: 0,
  estimatedRevenueForClient: 0,
  updatedAt: new Date().toISOString()
};

async function seed() {
  try {
    const outputDir = path.join(__dirname, '..', 'outputs', 'dashboard');
    
    // Create directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write initial state
    await fs.writeFile(
      path.join(outputDir, 'state.json'),
      JSON.stringify(initialState, null, 2)
    );
    
    // Initialize empty audit log
    await fs.writeFile(
      path.join(outputDir, 'audit.log'),
      ''
    );
    
    console.log('✅ Seeded initial state');
    console.log(`📁 State file: ${path.join(outputDir, 'state.json')}`);
    console.log(`📁 Audit log: ${path.join(outputDir, 'audit.log')}`);
  } catch (error) {
    console.error('❌ Error seeding initial state:', error.message);
    process.exit(1);
  }
}

seed();
