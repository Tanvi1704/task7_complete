import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../app/globals.css';
import ClientAuthWrapper  from "@/components/ClientAuthWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <ToastContainer />
        <ClientAuthWrapper>
        <main>{children}</main>
        </ClientAuthWrapper>
        <Footer />
      </body>
    </html>
  );
}
