import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-client-secret',
    }),
  ],
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_AUTH_SECRET ||
    'vedantverse-auth-secret-production-key-2026',
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});


