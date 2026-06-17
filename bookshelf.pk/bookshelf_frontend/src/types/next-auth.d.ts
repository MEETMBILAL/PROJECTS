import type { DefaultSession } from "next-auth";

import type { User as BookshelfUser } from "@/types/user";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & Partial<BookshelfUser>;
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    user?: BookshelfUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    profile?: BookshelfUser;
  }
}
