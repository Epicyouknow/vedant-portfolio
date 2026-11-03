import fs from 'fs';
import path from 'path';

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'content' | 'publishing' | 'access' | 'system';
  targetType: string;
  targetId?: string;
  targetTitle?: string;
  user: string;
  userEmail: string;
  userRole: string;
  timestamp: string;
  details?: string;
  beforeState?: any;
  afterState?: any;
}

const auditLogFile = path.join(process.cwd(), 'activity-log.json');

export function getAuditLogs(): AuditLogEntry[] {
  try {
    if (!fs.existsSync(auditLogFile)) {
      // Seed default initial logs
      const initialLogs: AuditLogEntry[] = [
        {
          id: 'log-1',
          action: 'Published Bellissima by Excel Case Study',
          category: 'publishing',
          targetType: 'case-study',
          targetId: 'bellissima-by-excel',
          targetTitle: 'Bellissima by Excel',
          user: 'Vedant Tiwari',
          userEmail: 'vedant@vedantverse.com',
          userRole: 'Owner',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          details: 'Updated verified CPL drop (-42%) and compliance recovery metrics.',
        },
        {
          id: 'log-2',
          action: 'Updated Homepage Hero copy',
          category: 'content',
          targetType: 'homepage',
          targetTitle: 'Homepage Hero',
          user: 'Vedant Tiwari',
          userEmail: 'vedant@vedantverse.com',
          userRole: 'Owner',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          details: 'Synchronized editorial hero statement with Creative Studio theme.',
        },
        {
          id: 'log-3',
          action: 'User Session Login',
          category: 'access',
          targetType: 'auth',
          user: 'Vedant Tiwari',
          userEmail: 'vedant@vedantverse.com',
          userRole: 'Owner',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          details: 'Authenticated via Command Centre security token.',
        },
        {
          id: 'log-4',
          action: 'System Build & Static Regeneration',
          category: 'system',
          targetType: 'system',
          user: 'System Bot',
          userEmail: 'system@vedantverse.in',
          userRole: 'System',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          details: 'Turbopack build completed successfully with 57 static routes.',
        },
      ];
      fs.writeFileSync(auditLogFile, JSON.stringify(initialLogs, null, 2), 'utf8');
      return initialLogs;
    }

    const raw = fs.readFileSync(auditLogFile, 'utf8');
    const logs = JSON.parse(raw);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('Error reading audit logs:', error);
    return [];
  }
}

export function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const logs = getAuditLogs();
  const newLog: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  logs.unshift(newLog);

  // Keep last 1,000 log records
  const trimmed = logs.slice(0, 1000);

  try {
    fs.writeFileSync(auditLogFile, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing audit log:', err);
  }

  return newLog;
}

