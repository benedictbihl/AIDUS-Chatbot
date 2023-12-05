import { NavBar } from "./components/NavBar";
import "./globals.css";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-work-sans",
});

export const metadata = {
  title: "AIDUS",
  description: "Your friendly AI urticaria expert",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${workSans.variable}`}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
