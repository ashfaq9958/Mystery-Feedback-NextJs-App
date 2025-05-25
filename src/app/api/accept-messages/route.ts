import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

// POST: Update the current user's message acceptance status
export async function POST(request: Request) {
  await dbConnect();

  // Get current session and authenticated user
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // If user is not authenticated, return 401
  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: User not authenticated." },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages }: { acceptMessages: boolean } = await request.json();

  try {
    // Update the user's message acceptance setting
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    // If user is not found, return 404
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found. Unable to update message settings.",
        },
        { status: 404 }
      );
    }

    // Return success response with updated user
    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance setting updated successfully.",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log and return internal server error
    console.error("Error updating message acceptance setting:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while updating message settings.",
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve the current user's message acceptance status
export async function GET(request: Request) {
  await dbConnect();

  // Get current session and authenticated user
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // If user is not authenticated, return 401
  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: User not authenticated." },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    // Find user by ID
    const foundUser = await UserModel.findById(userId);

    // If user not found, return 404
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Return the current message acceptance status
    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log and return internal server error
    console.error("Error retrieving message acceptance setting:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while retrieving message settings.",
      },
      { status: 500 }
    );
  }
}
