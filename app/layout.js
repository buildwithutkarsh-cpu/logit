import Link from "next/link";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Logit",
  description: "Hide a number. Send the link. See who cracks it.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <header className="bar wrap">
          <Link href="/" className="plate">LOGIT</Link>
          <nav>
            <Link href="/dashboard" className="navlink">Dashboard</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
