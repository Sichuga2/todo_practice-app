import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata =  {
  title: "Tasker - список задач с проектами",
  description: "Учебное веб-приложение для управления задачами",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              Главная страница
            </Link>
            <Link href="/" className="text-xl font-bold text-blue-600">
              Tasker
            </Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}