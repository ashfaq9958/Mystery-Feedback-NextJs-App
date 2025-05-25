import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Section,
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
          backgroundColor: "#f0f2f5",
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Header */}
          <Section
            style={{
              borderBottom: "2px solid #0070f3",
              paddingBottom: "10px",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0070f3",
                margin: 0,
              }}
            >
              Welcome to Our Platform!
            </Text>
          </Section>

          {/* Greeting */}
          <Text style={{ fontSize: "16px", marginBottom: "20px", color: "#333" }}>
            Hello <strong>{username}</strong>,
          </Text>

          <Text style={{ fontSize: "16px", marginBottom: "20px", color: "#333" }}>
            Thank you for joining us! We’re thrilled to have you on board. To complete your
            signup, please use the OTP provided below.
          </Text>

          {/* OTP Section */}
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "8px",
            }}
          >
            Your One-Time Password (OTP):
          </Text>

          <Text
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#0070f3",
              letterSpacing: "6px",
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            {otp}
          </Text>

          <Text style={{ fontSize: "14px", color: "#555", marginBottom: "30px" }}>
            This code is valid for the next 10 minutes. Please do not share it with anyone.
          </Text>

          {/* Call-to-action */}
          <Section style={{ textAlign: "center", marginBottom: "20px" }}>
            <a
              href="#"
              style={{
                backgroundColor: "#0070f3",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Verify Now
            </a>
          </Section>

          {/* Footer Note */}
          <Text
            style={{
              fontSize: "12px",
              color: "#999",
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            If you didn’t request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
