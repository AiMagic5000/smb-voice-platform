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

interface VoicemailEmailProps {
  recipientName: string;
  callerName?: string;
  callerNumber: string;
  duration: string;
  timestamp: string;
  transcription?: string;
  voicemailUrl?: string;
}

export function VoicemailEmail({
  recipientName,
  callerName,
  callerNumber,
  duration,
  timestamp,
  transcription,
  voicemailUrl,
}: VoicemailEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New voicemail from {callerName || callerNumber} - {duration}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>New Voicemail</Heading>

            <Text style={text}>Hi {recipientName},</Text>

            <Text style={text}>
              You have a new voicemail. Here are the details:
            </Text>

            <Section style={detailsBox}>
              <table style={detailsTable}>
                <tbody>
                  <tr>
                    <td style={detailLabel}>From:</td>
                    <td style={detailValue}>
                      {callerName || "Unknown Caller"}
                    </td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Number:</td>
                    <td style={detailValue}>{callerNumber}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Duration:</td>
                    <td style={detailValue}>{duration}</td>
                  </tr>
                  <tr>
                    <td style={detailLabel}>Received:</td>
                    <td style={detailValue}>{timestamp}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {transcription && (
              <>
                <Heading as="h2" style={h2}>
                  Transcription
                </Heading>
                <Section style={transcriptionBox}>
                  <Text style={transcriptionText}>&ldquo;{transcription}&rdquo;</Text>
                </Section>
              </>
            )}

            <Section style={buttonContainer}>
              {voicemailUrl && (
                <Button style={buttonPrimary} href={voicemailUrl}>
                  Listen to Voicemail
                </Button>
              )}
              <Button
                style={buttonSecondary}
                href={`tel:${callerNumber.replace(/\D/g, "")}`}
              >
                Call Back
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={smallText}>
              You can also listen to this voicemail in your{" "}
              <Link
                href="https://voice.startmybusiness.us/dashboard/voicemails"
                style={link}
              >
                dashboard
              </Link>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This notification was sent by SMB Voice.
              <br />
              <Link
                href="https://voice.startmybusiness.us/dashboard/settings"
                style={footerLink}
              >
                Manage notification settings
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
  padding: "24px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#C9A227",
  fontSize: "24px",
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
  fontSize: "16px",
  fontWeight: "bold",
  margin: "24px 0 12px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const smallText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const detailsBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "20px",
  margin: "16px 0",
};

const detailsTable = {
  width: "100%",
};

const detailLabel = {
  color: "#718096",
  fontSize: "14px",
  fontWeight: "500",
  padding: "4px 16px 4px 0",
  verticalAlign: "top",
  width: "100px",
};

const detailValue = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "600",
  padding: "4px 0",
  verticalAlign: "top",
};

const transcriptionBox = {
  backgroundColor: "#FDF8E8",
  borderRadius: "12px",
  padding: "20px",
  borderLeft: "4px solid #C9A227",
};

const transcriptionText = {
  color: "#4a5568",
  fontSize: "15px",
  lineHeight: "24px",
  fontStyle: "italic",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonPrimary = {
  backgroundColor: "#C9A227",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  margin: "0 8px 8px 0",
};

const buttonSecondary = {
  backgroundColor: "#ffffff",
  border: "2px solid #1E3A5F",
  borderRadius: "8px",
  color: "#1E3A5F",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "10px 24px",
  textDecoration: "none",
  margin: "0 0 8px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const link = {
  color: "#C9A227",
  textDecoration: "underline",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "20px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#718096",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};

const footerLink = {
  color: "#718096",
  textDecoration: "underline",
};

export default VoicemailEmail;
