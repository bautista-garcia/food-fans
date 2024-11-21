import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import "./globals.css";

import Navbar from "@/components/navbar/Navbar";

export const metadata = {
  title: "FoodReview App",
  description: "Upload and view food reviews on a map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionProviderWrapper>
        <body className="bg-gray-100 min-h-screen flex flex-col items-center text-black">
          <header className="bg-white shadow-sm w-full">
            <Navbar />
          </header>
          <main className="flex-grow w-full">{children}</main>
          <footer className="bg-white shadow-sm mt-8 w-full">
            <div className="container mx-auto px-4 py-4 text-center text-gray-600">
              © 2023 FoodReview App
            </div>
          </footer>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}
