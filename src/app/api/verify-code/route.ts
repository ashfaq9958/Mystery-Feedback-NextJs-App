import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Establish MongoDB connection
    await dbConnect();

    // Parse request body to extract username and verification code
    const { username, code } = await request.json();

    // Decode and sanitize the username
    const decodedUsername = decodeURIComponent(username.trim());

    // Find the user by username in the database
    const user = await UserModel.findOne({ username: decodedUsername });

    // If user does not exist, return a 404 response
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found with the provided username.",
        },
        { status: 404 }
      );
    }

    // Check if the provided code matches the stored verification code
    const isCodeCorrect = user.verifyCode === code;

    // Check if the verification code has not expired
    const isCodeStillValid = new Date(user.verifyCodeExpiry) > new Date();

    // If verification code is incorrect, return a 400 response
    if (!isCodeCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    // If verification code is expired, return a 410 response
    if (!isCodeStillValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to receive a new one.",
        },
        { status: 410 }
      );
    }

    // If code is correct and not expired, mark user as verified
    user.isVerified = true;
    await user.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Account has been successfully verified.",
      },
      { status: 200 }
    );
  } catch (error) {
    // Catch and log unexpected server errors
    console.error("Error verifying user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while verifying the account.",
      },
      { status: 500 }
    );
  }
}
