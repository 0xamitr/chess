import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../../../lib/dbConnect';
import bcrypt from 'bcrypt';
import User from '../../../../../models/users';

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
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Add custom fields to the session
      session.user.id = token.id; // Add user ID from token
      session.user.games = token.games; // Add custom role from token (if any)
      
      return session; // Return the modified session object
    },
    async jwt({ token, user }) {
      if (user) {
        // Add the user's ID and any other custom fields to the token
        token.id = user._id; // MongoDB document ID
        token.games = user.games; // Add custom role or other fields
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
