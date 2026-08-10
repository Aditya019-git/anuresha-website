import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anuresha.com"),
  title: "Anuresha Interior Pvt Ltd | Best Interior Designers & Civil Contractors in Pune & Mumbai",
  description: "Anuresha Interior Private Limited is Pune & Mumbai's leading turn-key interior design and property maintenance company. Specializing in modular furniture, painting, fabrication, ACP, glass work, civil work, and commercial projects.",
  keywords: [
    "Anuresha Interior Pvt Ltd",
    "Anuresha Interiors",
    "Interior Designers in Pune",
    "Interior Designers in Mumbai",
    "Civil Contractors Pune",
    "Property Maintenance Pune",
    "Modular Furniture Pune",
    "Commercial Interior Design",
    "Turnkey Projects Pune",
    "ACP Work Pune",
    "Epoxy Flooring Pune",
    "Road Transport Services Pune",
    "Bhosari Interior Designers",
    "Pimpri Chinchwad Interior Contractor"
  ],
  authors: [{ name: "Anuresha Interior Private Limited" }],
  creator: "Anuresha Interior Pvt Ltd",
  publisher: "Anuresha Interior Pvt Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.anuresha.com",
  },
  icons: {
    icon: [
      { url: "/images/logo_icon_transparent.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/images/logo_icon_transparent.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Anuresha Interior Pvt Ltd | Transforming Spaces, Building Trust",
    description: "Pune & Mumbai's trusted partner for turn-key interior design, modular furniture, civil construction, and property maintenance.",
    url: "https://www.anuresha.com",
    siteName: "Anuresha Interior Pvt Ltd",
    images: [
      {
        url: "https://www.anuresha.com/images/about_bg.png",
        width: 1200,
        height: 630,
        alt: "Anuresha Interior Pvt Ltd - Corporate & Residential Design Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuresha Interior Pvt Ltd | Interior Design & Civil Contractors",
    description: "Premium interior design, modular furniture, and property maintenance in Pune & Mumbai.",
    images: ["https://www.anuresha.com/images/about_bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Anuresha Interior Private Limited",
  "alternateName": ["Anuresha Interiors", "Anuresha Maintenance", "Anuresha"],
  "url": "https://www.anuresha.com",
  "logo": "https://www.anuresha.com/images/logo.png",
  "image": "https://www.anuresha.com/images/about_bg.png",
  "description": "Leading interior design, modular furniture, civil contracting, and property maintenance firm in Pune & Mumbai.",
  "telephone": ["+91-9604055295", "+91-9767592251"],
  "email": "info.anuresha@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sr. No. 219/2B, Subhadra Heights, Fl. No. C-401, Dighi Rd, Shivnagri Colony, Bhosari",
    "addressLocality": "Pimpri-Chinchwad, Pune",
    "addressRegion": "Maharashtra",
    "postalCode": "411039",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.6235,
    "longitude": 73.8436
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "20:00"
  },
  "priceRange": "₹₹-₹₹₹",
  "areaServed": [
    "Pune",
    "Mumbai",
    "Pimpri-Chinchwad",
    "Bhosari",
    "Hinjawadi",
    "Baner",
    "Wakad",
    "Kothrud",
    "Navi Mumbai",
    "Maharashtra"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Interior Design & Maintenance Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Modular Furniture & Carpentry" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Painting & Polishing Services" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Glass & Filming Work" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Road Transport Services" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fabrication & ACP Works" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Epoxy Flooring Solutions" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gypsum & False Ceiling Work" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical & Plumbing Works" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Solar Power System Installation" } }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-stone-50 text-stone-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
