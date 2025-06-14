import { Resend } from "resend";
import WelcomeEmail from "../../emailTemplate/WelcomeEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> { 
  try {
    await resend.emails.send({
      from: "Ashaque <ashfaque@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: WelcomeEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
