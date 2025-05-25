import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET: Fetch all messages for the authenticated user, sorted by latest
export async function GET(request: Request) {
  await dbConnect(); // Ensure DB connection

  const session = await getServerSession(authOptions); // Get current session
  const user = session?.user;

  // If the user is not authenticated, return 401
  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: User not authenticated." },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    // Aggregate messages from the user document, sorted by latest
    const userWithMessages = await UserModel.aggregate([
      { $match: { _id: userId } }, // Find the current user
      { $unwind: "$messages" }, // Flatten the messages array
      { $sort: { "messages.createdAt": -1 } }, // Sort by message creation date descending
      { $group: { _id: "$_id", messages: { $push: "$messages" } } }, // Re-group messages back into array
    ]);

    // If no user or messages found, return 404
    if (!userWithMessages || userWithMessages.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found or no messages available." },
        { status: 404 }
      );
    }

    // Return success with the sorted messages
    return NextResponse.json(
      {
        success: true,
        messages: userWithMessages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user messages:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while retrieving user messages.",
      },
      { status: 500 }
    );
  }
}
