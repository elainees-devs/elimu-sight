export interface AnalyticsEvent {
  event: string;
  schoolId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export function createAnalyticsEvent(
  event: string,
  metadata?: Record<string, unknown>
): AnalyticsEvent {
  return {
    event,
    metadata,
    timestamp: new Date(),
  };
}
