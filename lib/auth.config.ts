import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import type { Role, Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        // Restrict USER login to India only - US users cannot login
        if (user.role === "USER" && user.region === Region.US) {
          return null; // Block US users from logging in
        }

        // Ensure USER role is only for India
        if (user.role === "USER") {
          // Force region to INDIA for users
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            region: Region.INDIA,
          };
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          region: user.region,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.region = user.region;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        if (isRole(token.role)) {
          session.user.role = token.role;
        }
        if (isRegion(token.region)) {
          session.user.region = token.region;
        }
      }
      return session;
    },
  },
};

function isRole(value: unknown): value is Role {
  return value === "ADMIN" || value === "USER";
}

function isRegion(value: unknown): value is Region {
  return value === "INDIA" || value === "US";
}
