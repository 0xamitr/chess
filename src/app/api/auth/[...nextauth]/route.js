import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcrypt';
import User from '../../../../../models/users';
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error('No user found with that email');
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          // Return the user object (Mongoose document)
          return user;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          user.pending = true;
          return true
        }
        user._id = existingUser._id;
        user.name = existingUser.name;
      }
      return true;
    },
    async session({ session, token }) {
      // Add custom fields to the session
      if (token.pending)
        session.user.pending = true;
      session.user.id = token.id; // Add user ID from token
      session.user.games = token.games; // Add custom role from token (if any)
      session.user.name = token.name;

      return session; // Return the modified session object
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Add the user's ID and any other custom fields to the token
        token.id = user._id; // MongoDB document ID
        token.games = user.games; // Add custom role or other fields
        if (user.pending)
          token.pending = true;
      }
      if (trigger === "update" && session?.pending !== undefined) {
        token.pending = session.pending;
        token.name = session.name;
        token.id = session.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
