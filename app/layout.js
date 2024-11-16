import "./globals.css";

export const metadata = {
  title: "FoodReview App",
  description: "Upload and view food reviews on a map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col items-center text-black">
        <main className="w-full flex-grow">{children}</main>
        <footer className="bg-white shadow-sm mt-8 w-full">
          <div className="w-full px-4 py-4 text-center text-gray-600">
            © 2023 FoodReview App
          </div>
        </footer>
      </body>
    </html>
  );
}
