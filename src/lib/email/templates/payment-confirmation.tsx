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

interface PaymentConfirmationEmailProps {
  customerName: string;
  amount: number;
  invoiceNumber: string;
  paymentDate: string;
  planName: string;
  nextBillingDate: string;
  lastFourDigits: string;
  cardBrand: string;
  invoiceUrl?: string;
  dashboardUrl: string;
}

export function PaymentConfirmationEmail({
  customerName,
  amount,
  invoiceNumber,
  paymentDate,
  planName,
  nextBillingDate,
  lastFourDigits,
  cardBrand,
  invoiceUrl,
  dashboardUrl,
}: PaymentConfirmationEmailProps) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>
        Payment Received - {formatCurrency(amount)} for SMB Voice {planName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Success Banner */}
          <Section style={successBanner}>
            <Text style={checkmark}>&#10003;</Text>
            <Text style={successText}>Payment Successful</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Thank you for your payment, {customerName}!</Heading>

            <Text style={text}>
              We&apos;ve successfully received your payment of{" "}
              <strong>{formatCurrency(amount)}</strong> for your SMB Voice {planName}{" "}
              subscription.
            </Text>

            {/* Receipt Box */}
            <Section style={receiptBox}>
              <Text style={receiptTitle}>Payment Receipt</Text>

              <Row style={receiptRow}>
                <Column style={{ width: "50%" }}>
                  <Text style={receiptLabel}>Invoice Number</Text>
                </Column>
                <Column style={{ width: "50%", textAlign: "right" }}>
                  <Text style={receiptValue}>{invoiceNumber}</Text>
                </Column>
              </Row>

              <Row style={receiptRow}>
                <Column style={{ width: "50%" }}>
                  <Text style={receiptLabel}>Payment Date</Text>
                </Column>
                <Column style={{ width: "50%", textAlign: "right" }}>
                  <Text style={receiptValue}>{paymentDate}</Text>
                </Column>
              </Row>

              <Row style={receiptRow}>
                <Column style={{ width: "50%" }}>
                  <Text style={receiptLabel}>Payment Method</Text>
                </Column>
                <Column style={{ width: "50%", textAlign: "right" }}>
                  <Text style={receiptValue}>
                    {cardBrand} ****{lastFourDigits}
                  </Text>
                </Column>
              </Row>

              <Row style={receiptRow}>
                <Column style={{ width: "50%" }}>
                  <Text style={receiptLabel}>Plan</Text>
                </Column>
                <Column style={{ width: "50%", textAlign: "right" }}>
                  <Text style={receiptValue}>{planName}</Text>
                </Column>
              </Row>

              <Hr style={receiptHr} />

              <Row>
                <Column style={{ width: "50%" }}>
                  <Text style={totalLabel}>Amount Paid</Text>
                </Column>
                <Column style={{ width: "50%", textAlign: "right" }}>
                  <Text style={totalValue}>{formatCurrency(amount)}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              Your next billing date is <strong>{nextBillingDate}</strong>. You can
              manage your subscription and view billing history in your dashboard.
            </Text>

            <Section style={{ textAlign: "center" }}>
              <Button style={button} href={dashboardUrl}>
                Go to Dashboard
              </Button>

              {invoiceUrl && (
                <Button style={secondaryButton} href={invoiceUrl}>
                  View Invoice
                </Button>
              )}
            </Section>

            <Hr style={hr} />

            <Section style={infoSection}>
              <Heading as="h2" style={h2}>
                What&apos;s included in your plan:
              </Heading>

              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                Professional business phone number
              </Text>
              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                AI-powered virtual receptionist
              </Text>
              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                Unlimited domestic calling
              </Text>
              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                Business SMS messaging
              </Text>
              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                Voicemail with transcription
              </Text>
              <Text style={featureItem}>
                <span style={featureCheck}>&#10003;</span>
                Mobile & desktop apps
              </Text>
            </Section>

            <Hr style={hr} />

            <Text style={helpText}>
              Questions about your subscription?{" "}
              <Link href="mailto:billing@startmybusiness.us" style={link}>
                Contact billing support
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

const successBanner = {
  backgroundColor: "#DEF7EC",
  padding: "20px 40px",
  textAlign: "center" as const,
};

const checkmark = {
  color: "#03543F",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "1",
};

const successText = {
  color: "#03543F",
  fontSize: "18px",
  fontWeight: "600",
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
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const receiptBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
};

const receiptTitle = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const receiptRow = {
  marginBottom: "12px",
};

const receiptLabel = {
  color: "#718096",
  fontSize: "14px",
  margin: "0",
};

const receiptValue = {
  color: "#1E3A5F",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const receiptHr = {
  borderColor: "#e2e8f0",
  margin: "16px 0",
};

const totalLabel = {
  color: "#1E3A5F",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};

const totalValue = {
  color: "#03543F",
  fontSize: "20px",
  fontWeight: "bold",
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
  marginRight: "12px",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  border: "2px solid #1E3A5F",
  borderRadius: "8px",
  color: "#1E3A5F",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const infoSection = {
  marginBottom: "24px",
};

const featureItem = {
  color: "#4a5568",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
};

const featureCheck = {
  color: "#03543F",
  fontWeight: "bold",
  marginRight: "12px",
};

const helpText = {
  color: "#718096",
  fontSize: "14px",
  textAlign: "center" as const,
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

export default PaymentConfirmationEmail;
