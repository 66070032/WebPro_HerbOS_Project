import { Geist, Geist_Mono, Kanit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

const headerfont = localFont({
  src: [
    {
      path: "fonts/SaoChingcha/SaoChingcha-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-header",
});

export const metadata = {
  title: "HerbOS",
  description: "ตลาดขายสมุนไพร",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${kanit.variable} ${headerfont.variable}`}>
      <body className="font-kanit antialiased">
        {children}
      </body>
    </html>
  );
}