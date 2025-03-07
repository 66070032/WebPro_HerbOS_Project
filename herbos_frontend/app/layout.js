import { Geist, Geist_Mono, Kanit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// ✅ Import ฟอนต์ Kanit
const kanit = Kanit({
  weight: ["300", "400", "700"], // สามารถเลือกน้ำหนักที่ต้องการได้
  subsets: ["latin", "thai"],
  variable: "--font-kanit", // สร้างตัวแปร CSS
});

// ✅ Import ฟอนต์ไทยจากไฟล์ภายในโปรเจค
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
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
