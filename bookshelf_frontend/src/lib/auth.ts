import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authApi } from "@/lib/api/auth";
import { setAccessToken } from "@/lib/api/client";

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
          const tokens = await authApi.login(
            credentials.email,
            credentials.password,
          );
          return {
            id: String(tokens.user.id),
            name: tokens.user.full_name || tokens.user.username,
            email: tokens.user.email,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            user: tokens.user,
          } as unknown as never;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          accessToken: string;
          refreshToken: string;
          user: Record<string, unknown>;
        };
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.profile = u.user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        ...(token.profile as Record<string, unknown>),
      };
      if (token.accessToken) {
        setAccessToken(token.accessToken as string);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
