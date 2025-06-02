import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Use NextResponse for standard Next.js API route response handling

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();

  // Validate message ID format
  const { messageid } = params;
  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return NextResponse.json(
      { success: false, message: "Invalid message ID" },
      { status: 400 }
    );
  }

  // Get session and validate authentication
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.email) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    // Find user by email (email is more stable than _id from session)
    const userDoc = await UserModel.findOne({ email: session.user.email });
    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove message by ID
    const result = await UserModel.updateOne(
      { _id: userDoc._id },
      { $pull: { messages: { _id: messageid } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /messages/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
