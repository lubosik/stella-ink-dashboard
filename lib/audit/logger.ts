import { promises as fs } from 'fs';
import path from 'path';

export type AuditEntry = {
  timestamp: string;
  user: 'admin' | 'webhook' | 'api';
  action: 'update' | 'increment' | 'decrement' | 'reset' | 'error' | 'security';
  field: string;
  oldValue: number | string;
  newValue: number | string;
  details?: string;
};

const AUDIT_LOG_PATH = path.join(process.cwd(), 'outputs', 'dashboard', 'audit.log');

// In-memory audit log for production (Vercel)
let memoryAuditLog: AuditEntry[] = [];

export async function logAudit(entry: AuditEntry): Promise<void> {
  try {
    // In production (Vercel), use memory storage
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      memoryAuditLog.unshift(entry); // Add to beginning (newest first)
      
      // Keep only last 1000 entries to prevent memory issues
      if (memoryAuditLog.length > 1000) {
        memoryAuditLog = memoryAuditLog.slice(0, 1000);
      }
      
      console.log(`Audit logged: ${entry.user} ${entry.action} ${entry.field} (${entry.oldValue} → ${entry.newValue})`);
      return;
    }

    // In development, use file storage
    // Ensure the directory exists
    await fs.mkdir(path.dirname(AUDIT_LOG_PATH), { recursive: true });
    
    // Append the entry as a JSON line
    const logLine = JSON.stringify(entry) + '\n';
    await fs.appendFile(AUDIT_LOG_PATH, logLine, 'utf-8');
    
    console.log(`Audit logged: ${entry.user} ${entry.action} ${entry.field} (${entry.oldValue} → ${entry.newValue})`);
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Don't throw - audit logging failure shouldn't break the main operation
  }
}

export async function readAuditLog(limit?: number): Promise<AuditEntry[]> {
  try {
    // In production (Vercel), use memory storage
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      return limit ? memoryAuditLog.slice(0, limit) : memoryAuditLog;
    }

    // In development, use file storage
    const content = await fs.readFile(AUDIT_LOG_PATH, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    const entries: AuditEntry[] = lines.map(line => {
      try {
        return JSON.parse(line) as AuditEntry;
      } catch (error) {
        console.warn(`Invalid audit log entry: ${line}`);
        return null;
      }
    }).filter((entry): entry is AuditEntry => entry !== null);
    
    // Sort by timestamp (newest first)
    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? entries.slice(0, limit) : entries;
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      // Audit log doesn't exist yet, return empty array
      return [];
    }
    console.error('Failed to read audit log:', error);
    return [];
  }
}

export async function clearAuditLog(): Promise<void> {
  try {
    // In production (Vercel), clear memory storage
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      memoryAuditLog = [];
      console.log('Audit log cleared (memory)');
      return;
    }

    // In development, clear file storage
    await fs.writeFile(AUDIT_LOG_PATH, '', 'utf-8');
    console.log('Audit log cleared (file)');
  } catch (error) {
    console.error('Failed to clear audit log:', error);
    throw error;
  }
}
