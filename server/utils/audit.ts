import type { H3Event } from 'h3';
import { getAuthSession } from './auth';

const importantFields: Record<string, string[]> = {
  admin: ['email', 'toda_id'],
  super_admin: ['email', 'toda_id'],
  driver: ['plate_number', 'franchise_number', 'is_registered', 'toda_id'],
  fare: ['base_km', 'base_fare', 'fare_per_km'],
  report: ['status'],
  toda: ['name', 'barangay', 'city'],
  trip: ['trip_start', 'trip_end', 'driver_id'],
  user: ['email'],
};

export const logAudit = async (
  event: H3Event,
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  table_name: string,
  record_id: string | number,
  changes: Record<string, { old: any; new: any }> | null = null
) => {
  const db = event.context.cloudflare.env.truefare_db;
  const session = getAuthSession(event);

  if (!session) return; // Should we log anonymous actions? Probably not for this system.

  // Filter changes to only include important fields
  let filteredChanges = null;
  if (changes) {
    const important = importantFields[table_name] || [];
    const filtered: Record<string, any> = {};
    let hasChanges = false;

    for (const field in changes) {
      if (important.includes(field)) {
        filtered[field] = changes[field];
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      filteredChanges = JSON.stringify(filtered);
    }
  }

  try {
    await db.prepare(`
      INSERT INTO audit_trail (actor_id, actor_role, action, table_name, record_id, changes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      session.id,
      session.role,
      action,
      table_name,
      record_id,
      filteredChanges
    ).run();
  } catch (error) {
    console.error('Failed to log audit trail:', error);
  }
};
