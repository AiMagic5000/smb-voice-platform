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

interface PaymentFailedEmailProps {
  customerName: string;
  amount: number;
  invoiceNumber: string;
  lastFourDigits: string;
  cardBrand: string;
  updatePaymentUrl: string;
  retryDate?: string;
  daysUntilSuspension?: number;
}

export function PaymentFailedEmail({
  customerName,
  amount,
  invoiceNumber,
  lastFourDigits,
  cardBrand,
  updatePaymentUrl,
  retryDate,
  daysUntilSuspension = 7,
}: PaymentFailedEmailProps) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>Action Required: Payment Failed for Invoice {invoiceNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertIcon}>!</Text>
            <Text style={alertText}>Payment Failed</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              Hi {customerName}, we couldn&apos;t process your payment
            </Heading>

            <Text style={text}>
              We attempted to charge your {cardBrand} card ending in {lastFourDigits} for{" "}
              <strong>{formatCurrency(amount)}</strong> but the payment was declined.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>Invoice Number</Text>
              <Text style={infoValue}>{invoiceNumber}</Text>
              <Text style={infoLabel}>Amount Due</Text>
              <Text style={infoValue}>{formatCurrency(amount)}</Text>
              <Text style={infoLabel}>Payment Method</Text>
              <Text style={infoValue}>
                {cardBrand} ending in {lastFourDigits}
              </Text>
            </Section>

            <Text style={text}>
              To avoid any interruption to your service, please update your payment
              method within the next <strong>{daysUntilSuspension} days</strong>.
            </Text>

            {retryDate && (
              <Text style={text}>
                We&apos;ll automatically retry your payment on{" "}
                <strong>{retryDate}</strong>.
              </Text>
            )}

            <Button style={button} href={updatePaymentUrl}>
              Update Payment Method
            </Button>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Common reasons for payment failure:
            </Heading>

            <Text style={listItem}>
              <span style={bullet}>1.</span> Card expired or incorrect details
            </Text>
            <Text style={listItem}>
              <span style={bullet}>2.</span> Insufficient funds
            </Text>
            <Text style={listItem}>
              <span style={bullet}>3.</span> Bank declined the transaction
            </Text>
            <Text style={listItem}>
              <span style={bullet}>4.</span> Card issuer requires verification
            </Text>

            <Hr style={hr} />

            <Text style={helpText}>
              If you believe this is an error or need assistance, please contact us at{" "}
              <Link href="mailto:billing@startmybusiness.us" style={link}>
                billing@startmybusiness.us
              </Link>{" "}
              or call{" "}
              <Link href="tel:888-534-4145" style={link}>
                888-534-4145
              </Link>
              .
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

const alertBanner = {
  backgroundColor: "#FEE2E2",
  padding: "16px 40px",
  textAlign: "center" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
};

const alertIcon = {
  backgroundColor: "#DC2626",
  color: "#ffffff",
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0",
};

const alertText = {
  color: "#991B1B",
  fontSize: "16px",
  fontWeight: "600",
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
  margin: "0 0 16px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#FEF3C7",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const infoLabel = {
  color: "#92400E",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const infoValue = {
  color: "#78350F",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 16px",
};

const button = {
  backgroundColor: "#DC2626",
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

const listItem = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
  paddingLeft: "8px",
};

const bullet = {
  color: "#C9A227",
  fontWeight: "bold",
  marginRight: "8px",
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

export default PaymentFailedEmail;
