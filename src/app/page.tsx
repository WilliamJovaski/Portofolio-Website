import type { Metadata } from "next";
import CurvedDivider from "@/components/home/CurvedDivider";
import Hero from "@/components/home/Hero";
import LetsTalk from "@/components/home/LetsTalk";
import TechStack from "@/components/home/TechStack";
import WhatsUp from "@/components/home/WhatsUp";
import ProjectStack from "@/components/projects/ProjectStack";

export const metadata: Metadata = {
  title: {
    absolute: "William Jovaski · AI & Data Scientist",
  },
  description:
    "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
  alternates: {
    canonical: "https://williamjovaski.com",
  },
  openGraph: {
    title: "William Jovaski · AI & Data Scientist",
    description:
      "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
    url: "https://williamjovaski.com",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "William Jovaski · AI & Data Scientist",
    description:
      "Portfolio William Jovaski, AI & Data Scientist. Berfokus pada Machine Learning, Computer Vision, dan arsitektur sistem cerdas berbasis data.",
    images: ["/og-image.png"],
  },
};

// Home: intro (greeting + folder) dirender oleh <IntroOverlay> di root layout.
export default function HomePage() {
  return (
    <>
      <Hero />
      <CurvedDivider />
      <WhatsUp />
      <ProjectStack />
      <TechStack />
      <LetsTalk />
    </>
  );
}
