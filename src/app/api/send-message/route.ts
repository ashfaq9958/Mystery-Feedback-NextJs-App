import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { IMessage } from "@/model/User";

// Handle POST request to send a message to a specific user
export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse request body
    const { username, content } = await request.json();

    // Basic validation
    if (!username || !content) {
      return Response.json(
        { success: false, message: "Username and content are required." },
        { status: 400 }
      );
    }

    // Find user by username
    const user = await UserModel.findOne({ username });

    // If user not found
    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // If user has disabled receiving messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "This user is not accepting messages." },
        { status: 403 }
      );
    }

    // Create new message
    const newMessage: IMessage = {
      content,
      createdAt: new Date(),
    };

    // Push the message to user's message list
    user.messages.push(newMessage);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending message:", error);

    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
