import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = z
          .object({
            phone: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { phone, password } = validatedCredentials.data;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ phone, password }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.success || !data.data) {
            return null;
          }

          return data.data; // This should contain the user object with id, name, email, role, etc.
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When the user signs in, the `user` object from the `authorize` callback is passed.
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      // The `token` object is from the `jwt` callback.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.userId = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
