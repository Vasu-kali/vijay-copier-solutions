import NextAuth from "next-auth";

// Edge-compatible auth config (NO Prisma, NO Node.js-only modules)
// Providers are configured in auth.server.ts for API routes
const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login", error: "/auth/login" },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) { token.role = (user as any).role; token.id = user.id; }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  providers: [], // providers added in auth.server.ts for Node.js runtime
  secret: process.env.NEXTAUTH_SECRET,
});

export { auth, handlers, signIn, signOut };
