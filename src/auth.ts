import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import { saveGoogleRefreshToken } from '@/lib/googleTokenStore';

const googleAdminEmail =
  process.env.GOOGLE_ANALYTICS_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/webmasters.readonly',
            'https://www.googleapis.com/auth/analytics.readonly',
          ].join(' '),
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,
  trustHost: true,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google' || !googleAdminEmail) {
        return false;
      }

      const googleProfile = profile as
        | { email?: string; email_verified?: boolean }
        | undefined;

      const email = (
        user.email || googleProfile?.email || ''
      ).trim().toLowerCase();

      return (
        email === googleAdminEmail &&
        googleProfile?.email_verified === true
      );
    },
  },

  events: {
    async signIn({ account }) {
      if (
        account?.provider === 'google' &&
        account.refresh_token
      ) {
        await saveGoogleRefreshToken(account.refresh_token);
      }
    },
  },
});
