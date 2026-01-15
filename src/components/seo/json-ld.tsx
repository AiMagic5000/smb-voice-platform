// JSON-LD Structured Data for SEO
// These help search engines understand the content and display rich snippets

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SMB Voice",
    alternateName: "Start My Business Voice",
    url: "https://voice.startmybusiness.us",
    logo: "https://voice.startmybusiness.us/icons/icon-512x512.png",
    description:
      "Professional business phone system with AI receptionist for small businesses. Get a local or toll-free number for just $7.95/month.",
    foundingDate: "2019",
    sameAs: [
      "https://smbvoice.alwaysencrypted.com",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-888-534-4145",
        contactType: "customer service",
        areaServed: ["US", "CA"],
        availableLanguage: ["English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-888-534-4145",
        contactType: "sales",
        areaServed: ["US", "CA"],
        availableLanguage: ["English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SMB Voice",
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android, Web, Windows, macOS",
    offers: {
      "@type": "Offer",
      price: "7.95",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500",
      bestRating: "5",
      worstRating: "1",
    },
    description:
      "Professional business phone system with AI receptionist. Make and receive calls from your business number on any device.",
    featureList: [
      "Local or Toll-Free Business Number",
      "AI Receptionist",
      "Unlimited Calling (US & Canada)",
      "SMS Messaging",
      "Mobile Apps (iOS & Android)",
      "Desktop App",
      "Voicemail Transcription",
      "Call Recording",
      "Business Hours Routing",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "SMB Voice Business Phone Service",
    image: "https://voice.startmybusiness.us/og-image.png",
    description:
      "Professional business phone number with AI receptionist, mobile apps, and unlimited calling for just $7.95/month.",
    brand: {
      "@type": "Brand",
      name: "SMB Voice",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "7.95",
      highPrice: "49.95",
      priceCurrency: "USD",
      offerCount: "3",
      offers: [
        {
          "@type": "Offer",
          name: "Starter Plan",
          price: "7.95",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "7.95",
            priceCurrency: "USD",
            billingDuration: "P1M",
            unitText: "month",
          },
        },
        {
          "@type": "Offer",
          name: "Professional Plan",
          price: "19.95",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "19.95",
            priceCurrency: "USD",
            billingDuration: "P1M",
            unitText: "month",
          },
        },
        {
          "@type": "Offer",
          name: "Enterprise Plan",
          price: "49.95",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "49.95",
            priceCurrency: "USD",
            billingDuration: "P1M",
            unitText: "month",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "2500",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does SMB Voice cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SMB Voice starts at just $7.95/month for the Starter plan, which includes 1 phone number, unlimited calling, 500 SMS messages, and an AI receptionist. Professional ($19.95/mo) and Enterprise ($49.95/mo) plans are also available.",
        },
      },
      {
        "@type": "Question",
        name: "Can I keep my existing phone number?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer free number porting for all plans. Most numbers can be transferred within 5-10 business days.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a contract or setup fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No contracts, no setup fees, no hidden charges. Pay month-to-month and cancel anytime.",
        },
      },
      {
        "@type": "Question",
        name: "What is the AI Receptionist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI Receptionist answers calls 24/7, takes messages, schedules appointments, and routes calls based on your preferences. It's like having a professional receptionist that never takes a break.",
        },
      },
      {
        "@type": "Question",
        name: "Does SMB Voice have mobile apps?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! SMB Voice has native apps for iOS and Android, plus a desktop app and web access. You can make and receive calls from your business number on any device.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SMB Voice",
    url: "https://voice.startmybusiness.us",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://voice.startmybusiness.us/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined component for homepage
export function HomepageSchemas() {
  return (
    <>
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <ProductSchema />
      <FAQSchema />
      <WebsiteSchema />
    </>
  );
}
