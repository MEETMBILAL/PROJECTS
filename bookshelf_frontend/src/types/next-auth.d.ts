import type { DefaultSession } from "next-auth";
import type { User as AppUser } from "@/types/user";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: DefaultSession["user"] & Partial<AppUser>;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    user?: AppUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    profile?: AppUser;
  }
}
