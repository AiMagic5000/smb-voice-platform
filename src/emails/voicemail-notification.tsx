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

interface VoicemailNotificationProps {
  recipientName: string;
  callerName?: string;
  callerNumber: string;
  duration: string;
  timestamp: string;
  transcription?: string;
  listenUrl?: string;
}

export function VoicemailNotification({
  recipientName = "there",
  callerName,
  callerNumber = "(555) 123-4567",
  duration = "0:42",
  timestamp = "Today at 2:30 PM",
  transcription = "Hi, this is a message for you. Please call me back when you get a chance. Thanks!",
  listenUrl = "https://voice.startmybusiness.us/dashboard/voicemails",
}: VoicemailNotificationProps) {
  const displayName = callerName || callerNumber;

  return (
    <Html>
      <Head />
      <Preview>New voicemail from {displayName} ({duration})</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Section style={voicemailBadge}>
              <Text style={badgeText}>New Voicemail</Text>
            </Section>

            <Heading style={h1}>You have a new voicemail</Heading>

            <Text style={text}>Hi {recipientName},</Text>

            <Text style={text}>
              You received a voicemail from <strong>{displayName}</strong>.
            </Text>

            {/* Voicemail Details Card */}
            <Section style={card}>
              <Section style={cardRow}>
                <Text style={cardLabel}>From</Text>
                <Text style={cardValue}>{displayName}</Text>
              </Section>
              {callerName && (
                <Section style={cardRow}>
                  <Text style={cardLabel}>Number</Text>
                  <Text style={cardValue}>{callerNumber}</Text>
                </Section>
              )}
              <Section style={cardRow}>
                <Text style={cardLabel}>Duration</Text>
                <Text style={cardValue}>{duration}</Text>
              </Section>
              <Section style={cardRow}>
                <Text style={cardLabel}>Received</Text>
                <Text style={cardValue}>{timestamp}</Text>
              </Section>
            </Section>

            {/* Transcription */}
            {transcription && (
              <Section style={transcriptionSection}>
                <Text style={transcriptionLabel}>AI Transcription</Text>
                <Text style={transcriptionText}>&quot;{transcription}&quot;</Text>
              </Section>
            )}

            <Section style={buttonSection}>
              <Button style={button} href={listenUrl}>
                Listen to Voicemail
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={tipText}>
              <strong>Tip:</strong> You can manage your voicemail notification
              preferences in your{" "}
              <Link href="https://voice.startmybusiness.us/dashboard/settings" style={link}>
                account settings
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              SMB Voice by Start My Business Inc
            </Text>
            <Text style={footerLinks}>
              <Link href="https://voice.startmybusiness.us/dashboard" style={footerLink}>
                Dashboard
              </Link>
              {" | "}
              <Link href="https://voice.startmybusiness.us/dashboard/settings" style={footerLink}>
                Settings
              </Link>
              {" | "}
              <Link href="https://voice.startmybusiness.us/help" style={footerLink}>
                Support
              </Link>
            </Text>
            <Text style={footerAddress}>
              © {new Date().getFullYear()} Start My Business Inc.
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
  padding: "24px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const content = {
  padding: "40px",
};

const voicemailBadge = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const badgeText = {
  backgroundColor: "#C9A227",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  padding: "6px 16px",
  borderRadius: "20px",
  display: "inline-block",
  margin: "0",
};

const h1 = {
  color: "#1E3A5F",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const card = {
  backgroundColor: "#f7fafc",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "24px 0",
};

const cardRow = {
  display: "flex",
  justifyContent: "space-between" as const,
  borderBottom: "1px solid #e2e8f0",
  padding: "12px 0",
};

const cardLabel = {
  color: "#718096",
  fontSize: "14px",
  margin: "0",
};

const cardValue = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
  textAlign: "right" as const,
};

const transcriptionSection = {
  backgroundColor: "#FDF8E8",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "24px 0",
  borderLeft: "4px solid #C9A227",
};

const transcriptionLabel = {
  color: "#9E7E1E",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px",
};

const transcriptionText = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic" as const,
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

const tipText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const link = {
  color: "#C9A227",
  textDecoration: "underline",
};

const footer = {
  backgroundColor: "#f7fafc",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const footerLinks = {
  color: "#718096",
  fontSize: "13px",
  margin: "0 0 12px",
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

export default VoicemailNotification;
