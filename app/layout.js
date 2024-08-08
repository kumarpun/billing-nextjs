import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HYBE",
  description: "HYBE Food & Drinks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <div className="mt-8">
          <Toaster className="toast-container" />
        <AuthProvider>{children}</AuthProvider>
        </div>
        </div>
      </body>
    </html>
  );
}
