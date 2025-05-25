import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";

// Zod schema to validate the query string
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse query parameter from URL
    const { searchParams } = new URL(request.url);
    const usernameInput = searchParams.get("username");

    // Validate the input
    const validationResult = UsernameQuerySchema.safeParse({
      username: usernameInput,
    });

    if (!validationResult.success) {
      const validationErrors =
        validationResult.error.format().username?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            validationErrors.length > 0
              ? validationErrors.join(", ")
              : "Invalid or missing 'username' query parameter.",
        },
        { status: 400 }
      );
    }

    const { username } = validationResult.data;

    // Check if the username is already taken by a verified user
    const isUsernameTaken = await UserModel.exists({
      username,
      isVerified: true,
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already in use. Please choose another.",
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Username is available
    return NextResponse.json(
      {
        success: true,
        message: "Username is available.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
