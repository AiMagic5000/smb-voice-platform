import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  phoneNumber?: string;
}

export function WelcomeEmail({ firstName, phoneNumber }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SMB Voice - Your business phone is ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to SMB Voice, {firstName}!</Heading>

            <Text style={text}>
              Your professional business phone system is now active. Here&apos;s
              everything you need to get started in the next 5 minutes.
            </Text>

            {phoneNumber && (
              <Section style={phoneBox}>
                <Text style={phoneLabel}>Your New Business Number</Text>
                <Text style={phoneNumberStyle}>{phoneNumber}</Text>
              </Section>
            )}

            <Heading as="h2" style={h2}>
              Quick Start Guide
            </Heading>

            <Section style={stepBox}>
              <Text style={stepNumber}>1</Text>
              <Text style={stepText}>
                <strong>Download the App</strong>
                <br />
                Get our free app for iPhone, Android, or desktop. Find it in
                your dashboard under &ldquo;Download Apps&rdquo;.
              </Text>
            </Section>

            <Section style={stepBox}>
              <Text style={stepNumber}>2</Text>
              <Text style={stepText}>
                <strong>Set Up Your Greeting</strong>
                <br />
                Customize how your AI receptionist answers calls. Go to Settings
                → AI Receptionist.
              </Text>
            </Section>

            <Section style={stepBox}>
              <Text style={stepNumber}>3</Text>
              <Text style={stepText}>
                <strong>Make a Test Call</strong>
                <br />
                Call your new number from your personal phone to hear how it
                sounds to customers.
              </Text>
            </Section>

            <Button style={button} href="https://voice.startmybusiness.us/dashboard">
              Go to Your Dashboard
            </Button>

            <Hr style={hr} />

            <Text style={text}>
              <strong>Need help?</strong> Our team is available 24/7 at{" "}
              <Link href="tel:888-534-4145" style={link}>
                888-534-4145
              </Link>{" "}
              or email us at{" "}
              <Link href="mailto:support@startmybusiness.us" style={link}>
                support@startmybusiness.us
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Start My Business Inc.
              <br />
              United States
            </Text>
            <Text style={footerLinks}>
              <Link href="https://voice.startmybusiness.us/privacy" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link href="https://voice.startmybusiness.us/terms" style={footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  backgroundColor: "#1E3A5F",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#C9A227",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "40px",
};

const h1 = {
  color: "#1E3A5F",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px",
};

const h2 = {
  color: "#1E3A5F",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "32px 0 16px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const phoneBox = {
  backgroundColor: "#FDF8E8",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const phoneLabel = {
  color: "#9E7E1E",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const phoneNumberStyle = {
  color: "#1E3A5F",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const stepBox = {
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  margin: "16px 0",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
};

const stepNumber = {
  backgroundColor: "#C9A227",
  color: "#ffffff",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  flexShrink: "0",
  margin: "0",
};

const stepText = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const button = {
  backgroundColor: "#C9A227",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "24px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const link = {
  color: "#C9A227",
  textDecoration: "underline",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const footerLinks = {
  margin: "0",
};

const footerLink = {
  color: "#718096",
  fontSize: "12px",
  textDecoration: "underline",
};

export default WelcomeEmail;
