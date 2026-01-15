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
  Row,
  Column,
} from "@react-email/components";

interface TrialEndingEmailProps {
  customerName: string;
  trialEndDate: string;
  daysRemaining: number;
  planName: string;
  planPrice: number;
  phoneNumber?: string;
  upgradeUrl: string;
}

export function TrialEndingEmail({
  customerName,
  trialEndDate,
  daysRemaining,
  planName,
  planPrice,
  phoneNumber,
  upgradeUrl,
}: TrialEndingEmailProps) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>
        {`Your SMB Voice trial ends in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} - Add payment to continue`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Countdown Banner */}
          <Section style={countdownBanner}>
            <Text style={countdownNumber}>{daysRemaining}</Text>
            <Text style={countdownLabel}>day{daysRemaining !== 1 ? "s" : ""} left in your trial</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              Hi {customerName}, your free trial is ending soon
            </Heading>

            <Text style={text}>
              We hope you&apos;ve enjoyed using SMB Voice! Your free trial ends on{" "}
              <strong>{trialEndDate}</strong>. To keep your business phone system
              running without interruption, add a payment method before your trial
              expires.
            </Text>

            {phoneNumber && (
              <Section style={phoneBox}>
                <Text style={phoneLabel}>Your Business Number</Text>
                <Text style={phoneNumberStyle}>{phoneNumber}</Text>
                <Text style={phoneWarning}>
                  This number will be released if your trial expires without payment
                </Text>
              </Section>
            )}

            <Heading as="h2" style={h2}>
              What happens next?
            </Heading>

            <Section style={timeline}>
              <Row>
                <Column style={timelineColumn}>
                  <Text style={timelineDot}>1</Text>
                </Column>
                <Column style={{ width: "90%" }}>
                  <Text style={timelineText}>
                    <strong>Add your payment method</strong>
                    <br />
                    Your card won&apos;t be charged until your trial ends
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={timelineColumn}>
                  <Text style={timelineDot}>2</Text>
                </Column>
                <Column style={{ width: "90%" }}>
                  <Text style={timelineText}>
                    <strong>Trial converts to paid plan on {trialEndDate}</strong>
                    <br />
                    You&apos;ll be charged {formatCurrency(planPrice)}/month for {planName}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column style={timelineColumn}>
                  <Text style={timelineDot}>3</Text>
                </Column>
                <Column style={{ width: "90%" }}>
                  <Text style={timelineText}>
                    <strong>Keep everything you&apos;ve set up</strong>
                    <br />
                    Your phone number, settings, and contacts stay intact
                  </Text>
                </Column>
              </Row>
            </Section>

            <Button style={button} href={upgradeUrl}>
              Add Payment Method
            </Button>

            <Hr style={hr} />

            <Section style={planBox}>
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={planLabel}>Your Plan</Text>
                  <Text style={planName as any}>{planName}</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={planPrice as any}>
                    {formatCurrency(planPrice)}
                    <span style={planPeriod}>/mo</span>
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text style={helpText}>
              Questions about pricing or features?{" "}
              <Link href="mailto:support@startmybusiness.us" style={link}>
                Contact our team
              </Link>{" "}
              - we&apos;re happy to help you find the right plan.
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

const countdownBanner = {
  backgroundColor: "#FEF3C7",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const countdownNumber = {
  color: "#92400E",
  fontSize: "48px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "1",
};

const countdownLabel = {
  color: "#92400E",
  fontSize: "16px",
  margin: "8px 0 0",
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
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const phoneNumberStyle = {
  color: "#1E3A5F",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const phoneWarning = {
  color: "#DC2626",
  fontSize: "12px",
  margin: "0",
};

const timeline = {
  marginBottom: "24px",
};

const timelineColumn = {
  width: "40px",
  verticalAlign: "top" as const,
};

const timelineDot = {
  backgroundColor: "#C9A227",
  color: "#ffffff",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const timelineText = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 16px",
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
  margin: "8px 0 24px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const planBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "20px 24px",
  marginBottom: "24px",
};

const planLabel = {
  color: "#718096",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const planPeriod = {
  color: "#718096",
  fontSize: "14px",
  fontWeight: "normal",
};

const helpText = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "22px",
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

export default TrialEndingEmail;
