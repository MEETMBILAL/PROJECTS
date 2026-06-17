import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { API_URL } from "@/constants/config";
import type { User } from "@/types/user";

interface BackendLogin {
  access: string;
  refresh: string;
  user: User;
}

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
        if (!credentials?.email || !credentials.password) return null;
        try {
          const { data } = await axios.post<{ data: BackendLogin }>(
            `${API_URL}/auth/login/`,
            {
              email: credentials.email,
              password: credentials.password,
            },
          );
          const payload = data.data;
          if (!payload?.access) return null;
          return {
            id: String(payload.user.id),
            name: payload.user.full_name || payload.user.username,
            email: payload.user.email,
            accessToken: payload.access,
            refreshToken: payload.refresh,
            user: payload.user,
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
        token.accessToken = (user as { accessToken: string }).accessToken;
        token.refreshToken = (user as { refreshToken: string }).refreshToken;
        token.profile = (user as { user: User }).user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        ...(token.profile as User),
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
