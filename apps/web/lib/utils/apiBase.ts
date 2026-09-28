/**
 * Centralized API base URL resolver for PolarOne.
 * Guarantees that whether NEXT_PUBLIC_API_URL is:
 * - unset (defaults to http://localhost:8000)
 * - a bare origin (https://backend-production-78f6.up.railway.app)
 * - an origin with slash (https://backend-production-78f6.up.railway.app/)
 * - or already has /api or /api/v1
 * It always resolves cleanly to .../api/v1 and appends the requested endpoint subpath.
 */

export function getApiBase(subPath: string = ''): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  let clean = envUrl.replace(/\/+$/, '');
  
  if (!clean.endsWith('/api/v1')) {
    if (clean.endsWith('/api')) {
      clean = `${clean}/v1`;
    } else {
      clean = `${clean}/api/v1`;
    }
  }

  if (!subPath) return clean;
  const cleanSub = subPath.replace(/^\/+/, '').replace(/\/+$/, '');
  return `${clean}/${cleanSub}`;
}
