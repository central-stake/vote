import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/NavBar";
// import 'firebase/remote-config';
import { RemoteConfigProvider } from "./components/RemoteConfiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vote now!",
  description: "Make the vote great again",
  openGraph: {
    title: "Vote now!",
    description: "Make the vote great again",
    url: "https://new-vote.netlify.app/",
    type: "website",
    images: [
      {
        url: "https://new-vote.netlify.app/assets/vote-now.jpg",
        type: "image/jpg",
        width: 1200,
        height: 630,
        alt: "vote-now",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vote now!",
    description: "Make the vote great again",
    images: [
      {
        url: "https://new-vote.netlify.app/assets/vote-now.jpg",
        type: "image/jpg",
        width: 1200,
        height: 630,
        alt: "vote-now",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} theme-blue`}>
        <RemoteConfigProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
          </ThemeProvider>
        </RemoteConfigProvider>
      </body>
    </html>
  );
}
