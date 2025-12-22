// lib/auth.config.ts
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
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("Invalid credentials format");
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
          });

          if (!user?.passwordHash) {
            console.error("User not found or no password hash");
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            parsed.data.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            console.error("Invalid password");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            region: user.region,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Important: Let middleware handle authorization
    authorized() {
      return true; // Always return true, middleware will handle route protection
    },
    async jwt({ token, user }) {
      // Initial sign in
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
  debug: process.env.NODE_ENV === "development",
};

function isRole(value: unknown): value is Role {
  return value === "ADMIN" || value === "USER";
}

function isRegion(value: unknown): value is Region {
  return value === "INDIA" || value === "US";
}
