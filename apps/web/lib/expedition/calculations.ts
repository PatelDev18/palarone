import { RiskLevel } from '@/types/expedition';

/**
 * Calculate distance in nautical miles between two lat/lon coordinates
 * using Haversine formula
 */
export function calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065; // Radius of the Earth in nautical miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Categorize risk score into visual level
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

/**
 * Format hours into clean human-readable duration
 */
export function formatDurationHours(hours: number): string {
  if (!hours || hours === 0) return 'On Schedule';
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  if (days > 0) {
    return `+${days}d ${remainingHours}h`;
  }
  return `+${remainingHours}h`;
}

/**
 * Format timestamp into military/polar mission format
 */
export function formatPolarTimestamp(isoString?: string): string {
  if (!isoString) return 'Awaiting data';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toISOString().replace('T', ' ').substring(0, 16) + 'Z';
  } catch {
    return 'Invalid date';
  }
}
