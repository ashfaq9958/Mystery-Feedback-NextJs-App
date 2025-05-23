import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
} from "@react-email/components";

type WelcomeEmailProps = {
  username: string;
  otp: string;
};

export default function WelcomeEmail({ username, otp }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP code is {otp}</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Text style={{ fontSize: "16px", marginBottom: "20px" }}>
            Hello {username},<br />
            <br />
            Thanks for joining us. We’re excited to have you on board.
          </Text>

          <Text style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
            Your One-Time Password (OTP):
          </Text>

          <Text
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#0070f3",
              letterSpacing: "4px",
              margin: "10px 0",
            }}
          >
            {otp}
          </Text>

          <Text style={{ fontSize: "14px", color: "#666" }}>
            Please use this code to verify your account. This code is valid for
            the next 10 minutes.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
