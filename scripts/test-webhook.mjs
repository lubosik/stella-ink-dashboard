#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET || 'test-secret';
const webhookUrl = process.argv[2] || 'http://localhost:3000/api/webhooks/calendly';

async function testWebhook() {
  try {
    // Read sample payload
    const sampleFile = path.join(process.cwd(), 'outputs', 'dashboard', 'SEED-SAMPLES', 'invitee.created.json');
    const payload = await fs.readFile(sampleFile, 'utf-8');
    
    // Create signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload, 'utf8');
    const signature = hmac.digest('hex');
    
    // Send webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Calendly-Signature': signature,
      },
      body: payload,
    });
    
    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
      console.log(`📡 URL: ${webhookUrl}`);
      console.log(`🔐 Secret: ${webhookSecret}`);
      console.log(`📊 Response: ${result}`);
    } else {
      console.error('❌ Webhook test failed!');
      console.error(`📡 URL: ${webhookUrl}`);
      console.error(`🔐 Secret: ${webhookSecret}`);
      console.error(`📊 Status: ${response.status}`);
      console.error(`📊 Response: ${result}`);
    }
    
  } catch (error: any) {
    console.error('❌ Error testing webhook:', error.message);
    process.exit(1);
  }
}

testWebhook();
