import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseGPT - AI-Powered Course Authoring Platform",
  description:
    "Create engaging and structured lessons with AI assistance. Streamline your course creation process with intelligent templates and content generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://websight.srexrg.me/tracker.js"
          data-site="coursegpt.srexrg.me"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
