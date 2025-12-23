import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chamberlain PMHNP Study App",
  description:
    "Interactive study app for Chamberlain Psychiatric Mental Health Nurse Practitioner program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
