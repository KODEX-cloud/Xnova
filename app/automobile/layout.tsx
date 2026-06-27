import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AutomobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </>
  );
}
