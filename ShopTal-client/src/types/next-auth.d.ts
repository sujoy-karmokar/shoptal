import "next-auth";

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      accessToken: string;
      userId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    accessToken: string;
    userId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
