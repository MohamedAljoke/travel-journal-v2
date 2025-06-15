import * as SentryServerless from "@sentry/aws-serverless";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

SentryServerless.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0,
});

export class SentryExceptionCatcher {
  private executor: typeof SentryServerless;

  constructor() {
    this.executor = SentryServerless;
  }
  catchException({
    exception,
    tags,
  }: {
    exception: Error;
    tags?: { [key: string]: string };
  }): void {
    this.executor.captureException(exception, { tags });
  }
}
