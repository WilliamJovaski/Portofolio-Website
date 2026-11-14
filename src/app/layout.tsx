import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { IntroProvider } from "@/components/intro/IntroProvider";
import IntroOverlay from "@/components/intro/IntroOverlay";
import SideTabs from "@/components/about/SideTabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://williamjovaski.com"),
  title: {
    default: "William Jovaski · AI & Data Scientist",
    template: "%s · William Jovaski",
  },
  description:
    "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
  alternates: {
    canonical: "https://williamjovaski.com",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://williamjovaski.com",
    title: "William Jovaski · AI & Data Scientist",
    description:
      "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
    siteName: "William Jovaski",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "William Jovaski · AI & Data Scientist Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "William Jovaski · AI & Data Scientist",
    description:
      "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fontVariables} antialiased`}>
      <body className="min-h-screen">
        <IntroProvider>
          {/* Intro hanya tampil di load pertama "/" */}
          <IntroOverlay />
          <Navbar />
          <SideTabs />
          <main>{children}</main>
          <Footer />
        </IntroProvider>
      </body>
    </html>
  );
}
