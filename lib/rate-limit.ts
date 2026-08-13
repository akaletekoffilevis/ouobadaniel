type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
const MAX = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function tooManyAttempts(ip: string): boolean {
  const e = store.get(ip);
  if (!e) return false;
  if (e.resetAt <= Date.now()) {
    store.delete(ip);
    return false;
  }
  return e.count >= MAX;
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const e = store.get(ip);
  if (!e || e.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  e.count += 1;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
