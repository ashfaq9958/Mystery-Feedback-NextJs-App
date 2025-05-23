import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/resend";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Establish database connection
  await dbConnect();

  try {
    // Parse the request body
    const { email, username, password } = await request.json();

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Check if a verified user already exists with the same username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user already exists with the same email
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate 6-digit verification code and its expiry (1 hour from now)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // If the user already verified their email, block registration
        return NextResponse.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      }

      // Update the existing unverified user's credentials
      existingUserByEmail.password = await bcrypt.hash(password, 10);
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = expiryDate;
      await existingUserByEmail.save();
    } else {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      // Save new user to the database
      await newUser.save();
    }

    // Send the verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // Handle email sending failure
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    // Return success response if everything succeeded
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Catch any unexpected errors
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
