import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authApi } from "@/lib/api/auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const result = await authApi.login(credentials.email, credentials.password);
          return {
            id: String(result.user.id),
            name: result.user.full_name || result.user.username,
            email: result.user.email,
            image: result.user.avatar || null,
            accessToken: result.access,
            refreshToken: result.refresh,
            user: result.user,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.profile = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      if (token.profile) {
        session.user = {
          ...session.user,
          ...token.profile,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
