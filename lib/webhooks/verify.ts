import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret) {
    console.warn('Webhook signature or secret is missing.');
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload, 'utf8');
    const computedSignature = hmac.digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(computedSignature, 'utf8')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

export async function verifyWebhook(req: Request, rawBody: string): Promise<boolean> {
  const signature = req.headers.get('X-Calendly-Signature');
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return false;
  }
  
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody);
    const computed = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computed)
    );
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export async function logAuditEntry(entry: {
  timestamp: string;
  user: 'admin' | 'webhook';
  action: 'update' | 'increment' | 'decrement';
  field: string;
  oldValue: number;
  newValue: number;
}): Promise<void> {
  try {
    const auditPath = path.join(process.cwd(), 'outputs', 'dashboard', 'audit.log');
    const line = JSON.stringify(entry) + '\n';
    await fs.appendFile(auditPath, line);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('X-Forwarded-For');
  const realIP = req.headers.get('X-Real-IP');
  const cfConnectingIP = req.headers.get('CF-Connecting-IP');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

export function isIPAllowed(clientIP: string): boolean {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',').map(ip => ip.trim()) || [];
  
  if (allowedIPs.length === 0) {
    return true; // No IP restriction
  }
  
  return allowedIPs.includes(clientIP);
}
