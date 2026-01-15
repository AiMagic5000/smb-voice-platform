import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  businessName?: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  firstName = "there",
  businessName = "Your Business",
  loginUrl = "https://voice.startmybusiness.us/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SMB Voice - Your business phone system is ready!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to SMB Voice!</Heading>

            <Text style={text}>Hi {firstName},</Text>

            <Text style={text}>
              Thanks for signing up for SMB Voice. Your professional business phone
              system is now ready to use. Here&apos;s what you can do next:
            </Text>

            <Section style={features}>
              <Text style={featureItem}>
                <strong style={featureIcon}>1</strong>
                <strong>Set up your phone number</strong> - Choose a local or toll-free
                number for your business
              </Text>
              <Text style={featureItem}>
                <strong style={featureIcon}>2</strong>
                <strong>Create team extensions</strong> - Add your team members with their
                own extensions
              </Text>
              <Text style={featureItem}>
                <strong style={featureIcon}>3</strong>
                <strong>Configure AI Receptionist</strong> - Let our AI handle calls when
                you&apos;re busy
              </Text>
            </Section>

            <Section style={buttonSection}>
              <Button style={button} href={loginUrl}>
                Go to Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={text}>
              Your plan includes 500 minutes per month, perfect for small businesses.
              If you need more, you can easily upgrade from your dashboard.
            </Text>

            <Text style={text}>
              Need help getting started? Check out our{" "}
              <Link href="https://voice.startmybusiness.us/help" style={link}>
                Getting Started Guide
              </Link>{" "}
              or contact our support team - we&apos;re here 24/7!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              SMB Voice by Start My Business Inc
              <br />
              Making business communication simple.
            </Text>
            <Text style={footerLinks}>
              <Link href="https://voice.startmybusiness.us/privacy" style={footerLink}>
                Privacy Policy
              </Link>
              {" | "}
              <Link href="https://voice.startmybusiness.us/terms" style={footerLink}>
                Terms of Service
              </Link>
              {" | "}
              <Link href="https://voice.startmybusiness.us/help" style={footerLink}>
                Support
              </Link>
            </Text>
            <Text style={footerAddress}>
              © {new Date().getFullYear()} Start My Business Inc. All rights reserved.
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
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "16px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const header = {
  backgroundColor: "#1E3A5F",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const content = {
  padding: "40px",
};

const h1 = {
  color: "#1E3A5F",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const features = {
  backgroundColor: "#f7fafc",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const featureItem = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
  paddingLeft: "40px",
  position: "relative" as const,
};

const featureIcon = {
  position: "absolute" as const,
  left: "0",
  width: "28px",
  height: "28px",
  backgroundColor: "#C9A227",
  color: "#ffffff",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center" as const,
  justifyContent: "center" as const,
  fontSize: "14px",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#C9A227",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const hr = {
  borderColor: "#e2e8f0",
  borderTop: "1px solid #e2e8f0",
  margin: "24px 0",
};

const link = {
  color: "#C9A227",
  textDecoration: "underline",
};

const footer = {
  backgroundColor: "#f7fafc",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const footerLinks = {
  color: "#718096",
  fontSize: "13px",
  margin: "0 0 16px",
};

const footerLink = {
  color: "#718096",
  textDecoration: "underline",
};

const footerAddress = {
  color: "#a0aec0",
  fontSize: "12px",
  margin: "0",
};

export default WelcomeEmail;
