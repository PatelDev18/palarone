import { ExpeditionStatus } from '@/types/expedition';

/**
 * Valid lifecycle transitions for Antarctic missions
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<ExpeditionStatus, ExpeditionStatus[]> = {
  'DRAFT': ['PLANNING', 'CANCELLED'],
  'PLANNING': ['READY FOR APPROVAL', 'DRAFT', 'CANCELLED'],
  'READY FOR APPROVAL': ['APPROVED', 'PLANNING', 'CANCELLED'],
  'APPROVED': ['PRE-DEPARTURE', 'PLANNING', 'CANCELLED'],
  'PRE-DEPARTURE': ['IN TRANSIT', 'SUSPENDED', 'CANCELLED'],
  'IN TRANSIT': ['OPERATIONAL', 'PARTIALLY BLOCKED', 'BLOCKED', 'SUSPENDED', 'RETURNING'],
  'OPERATIONAL': ['RETURNING', 'PARTIALLY BLOCKED', 'BLOCKED', 'SUSPENDED', 'COMPLETED'],
  'PARTIALLY BLOCKED': ['OPERATIONAL', 'BLOCKED', 'SUSPENDED', 'RETURNING'],
  'BLOCKED': ['OPERATIONAL', 'PARTIALLY BLOCKED', 'SUSPENDED', 'RETURNING'],
  'SUSPENDED': ['OPERATIONAL', 'PLANNING', 'RETURNING', 'CANCELLED'],
  'RETURNING': ['COMPLETED', 'PARTIALLY BLOCKED', 'BLOCKED', 'SUSPENDED'],
  'COMPLETED': ['ARCHIVED'],
  'CANCELLED': ['ARCHIVED'],
  'ARCHIVED': []
};

export function canTransitionStatus(current: ExpeditionStatus, target: ExpeditionStatus): boolean {
  if (current === target) return true;
  const allowed = ALLOWED_STATUS_TRANSITIONS[current] || [];
  return allowed.includes(target);
}

export function validateExpeditionCreation(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Expedition Name is required.');
  }
  if (!data.lead || data.lead.trim().length === 0) {
    errors.push('Expedition Lead is required.');
  }
  if (!data.mission_type) {
    errors.push('Mission Type must be selected.');
  }
  if (!data.planned_start) {
    errors.push('Planned departure date is required.');
  }
  if (!data.planned_end) {
    errors.push('Planned arrival / completion date is required.');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
