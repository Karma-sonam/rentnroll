// app/layout.js
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NextAuthProvider } from '../components/NextAuthProvider';

export const metadata = {
  title: "Rent'n'Roll - Premium Car Rentals in Bhutan",
  description: "Experience Bhutan's majestic landscapes with our quality car rental services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}