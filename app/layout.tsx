import type { Metadata } from "next";
import "./globals.css";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Андрей — инженер трансляций",
  description:
    "Портфолио Андрея Варнавского — прямые эфиры, мультимедийные системы, звук, графика и автоматизация.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
