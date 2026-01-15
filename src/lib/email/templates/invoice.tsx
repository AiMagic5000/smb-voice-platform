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

interface InvoiceLineItem {
  description: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
}

interface InvoiceEmailProps {
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax?: number;
  total: number;
  invoiceUrl: string;
  pdfUrl?: string;
  status: "paid" | "open" | "overdue";
}

export function InvoiceEmail({
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  lineItems,
  subtotal,
  tax = 0,
  total,
  invoiceUrl,
  pdfUrl,
  status,
}: InvoiceEmailProps) {
  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const statusStyles = {
    paid: { bg: "#DEF7EC", color: "#03543F", text: "Paid" },
    open: { bg: "#FEF3C7", color: "#92400E", text: "Due" },
    overdue: { bg: "#FEE2E2", color: "#991B1B", text: "Overdue" },
  };

  const currentStatus = statusStyles[status];

  return (
    <Html>
      <Head />
      <Preview>
        Invoice {invoiceNumber} - {currentStatus.text} - {formatCurrency(total)}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>SMB Voice</Heading>
          </Section>

          {/* Invoice Title */}
          <Section style={content}>
            <Row>
              <Column>
                <Heading style={h1}>Invoice</Heading>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text
                  style={{
                    ...statusBadge,
                    backgroundColor: currentStatus.bg,
                    color: currentStatus.color,
                  }}
                >
                  {currentStatus.text}
                </Text>
              </Column>
            </Row>

            {/* Invoice Details */}
            <Section style={detailsSection}>
              <Row>
                <Column>
                  <Text style={labelText}>Invoice Number</Text>
                  <Text style={valueText}>{invoiceNumber}</Text>
                </Column>
                <Column>
                  <Text style={labelText}>Invoice Date</Text>
                  <Text style={valueText}>{invoiceDate}</Text>
                </Column>
                <Column>
                  <Text style={labelText}>Due Date</Text>
                  <Text style={valueText}>{dueDate}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Bill To */}
            <Text style={labelText}>Bill To</Text>
            <Text style={valueText}>{customerName}</Text>

            <Hr style={hr} />

            {/* Line Items */}
            <Section style={tableHeader}>
              <Row>
                <Column style={{ width: "60%" }}>
                  <Text style={tableHeaderText}>Description</Text>
                </Column>
                <Column style={{ width: "20%", textAlign: "center" }}>
                  <Text style={tableHeaderText}>Qty</Text>
                </Column>
                <Column style={{ width: "20%", textAlign: "right" }}>
                  <Text style={tableHeaderText}>Amount</Text>
                </Column>
              </Row>
            </Section>

            {lineItems.map((item, index) => (
              <Section key={index} style={tableRow}>
                <Row>
                  <Column style={{ width: "60%" }}>
                    <Text style={tableCell}>{item.description}</Text>
                  </Column>
                  <Column style={{ width: "20%", textAlign: "center" }}>
                    <Text style={tableCell}>
                      {item.quantity || 1}
                    </Text>
                  </Column>
                  <Column style={{ width: "20%", textAlign: "right" }}>
                    <Text style={tableCell}>{formatCurrency(item.amount)}</Text>
                  </Column>
                </Row>
              </Section>
            ))}

            <Hr style={hr} />

            {/* Totals */}
            <Section style={totalsSection}>
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={totalsLabel}>Subtotal</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={totalsValue}>{formatCurrency(subtotal)}</Text>
                </Column>
              </Row>
              {tax > 0 && (
                <Row>
                  <Column style={{ width: "70%" }}>
                    <Text style={totalsLabel}>Tax</Text>
                  </Column>
                  <Column style={{ width: "30%", textAlign: "right" }}>
                    <Text style={totalsValue}>{formatCurrency(tax)}</Text>
                  </Column>
                </Row>
              )}
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={totalValue}>{formatCurrency(total)}</Text>
                </Column>
              </Row>
            </Section>

            {/* Action Buttons */}
            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              {status !== "paid" && (
                <Button style={button} href={invoiceUrl}>
                  Pay Invoice
                </Button>
              )}
              {pdfUrl && (
                <Button style={secondaryButton} href={pdfUrl}>
                  Download PDF
                </Button>
              )}
            </Section>

            <Hr style={hr} />

            <Text style={helpText}>
              Questions about this invoice?{" "}
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

const content = {
  padding: "40px",
};

const h1 = {
  color: "#1E3A5F",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
};

const statusBadge = {
  display: "inline-block",
  padding: "6px 16px",
  borderRadius: "20px",
  fontSize: "14px",
  fontWeight: "600",
};

const detailsSection = {
  marginTop: "24px",
  marginBottom: "24px",
};

const labelText = {
  color: "#718096",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const valueText = {
  color: "#1E3A5F",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
};

const tableHeader = {
  backgroundColor: "#f8fafc",
  padding: "12px 16px",
  borderRadius: "8px 8px 0 0",
};

const tableHeaderText = {
  color: "#718096",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "0",
};

const tableRow = {
  padding: "12px 16px",
  borderBottom: "1px solid #e2e8f0",
};

const tableCell = {
  color: "#4a5568",
  fontSize: "14px",
  margin: "0",
};

const totalsSection = {
  marginTop: "16px",
};

const totalsLabel = {
  color: "#718096",
  fontSize: "14px",
  margin: "4px 0",
};

const totalsValue = {
  color: "#4a5568",
  fontSize: "14px",
  margin: "4px 0",
};

const totalLabel = {
  color: "#1E3A5F",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "8px 0 4px",
};

const totalValue = {
  color: "#1E3A5F",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "8px 0 4px",
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
  marginRight: "16px",
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

export default InvoiceEmail;
