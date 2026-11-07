import 'server-only';
import { auth } from '@/auth';

export async function isGoogleAnalyticsAuthorized(): Promise<boolean> {
  const session = await auth();

  const allowedEmail = process.env.GOOGLE_ANALYTICS_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

  const signedInEmail = session?.user?.email?.trim().toLowerCase();

  return Boolean(
    allowedEmail && signedInEmail && allowedEmail === signedInEmail
  );
}
