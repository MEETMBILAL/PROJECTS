import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { API_URL } from "@/constants/config";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await axios.post(`${API_URL}/auth/login/`, {
            email: credentials.email,
            password: credentials.password,
          });
          const payload = res.data?.data;
          if (!payload?.access) return null;
          return {
            id: String(payload.user.id),
            name: payload.user.full_name || payload.user.username,
            email: payload.user.email,
            accessToken: payload.access,
            refreshToken: payload.refresh,
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
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (
          user as { refreshToken?: string }
        ).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as { accessToken?: string }).accessToken =
        token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "development-secret-change-me",
};
