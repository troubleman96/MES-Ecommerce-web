/**
 * Error reporting utility — thin shim kept for backward compatibility.
 * Previously delegated to Lovable's dev-server bridge; now a no-op stub
 * that simply logs errors to the console. Swap this out with your own
 * error-tracking integration (e.g. Sentry) when needed.
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[ErrorBoundary]", context, error);
}
