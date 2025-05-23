import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  // Providers define the authentication methods available
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Function to authorize user login
      async authorize(credentials: any): Promise<User | null> {
        // Basic validation
        if (!credentials || !credentials.identifier || !credentials.password) {
          throw new Error("Missing credentials");
        }

        // Connect to the database
        await dbConnect();

        // Normalize identifier input (email or username)
        const identifier = credentials.identifier.trim().toLowerCase();

        // Find user by email or username
        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        }).lean(); // `.lean()` improves performance by returning plain JS object

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Check if account is verified
        if (!user.isVerified) {
          throw new Error("Account not verified. Please check your email.");
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        // Remove sensitive data before returning
        const { password, ...safeUser } = user as any;
        return safeUser;
      },
    }),
  ],

  // Callbacks allow us to control JWT and session behavior
  callbacks: {
    // Customize JWT token
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Ensure ObjectId is string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    // Customize session returned to client
    async session({ session, token }) {
      if (session.user && token) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  // Use JWT for session strategy
  session: {
    strategy: "jwt",
  },

  // Secret used for signing tokens
  secret: process.env.NEXTAUTH_SECRET,

  // Custom sign-in page
  pages: {
    signIn: "/sign-in",
  },
};
