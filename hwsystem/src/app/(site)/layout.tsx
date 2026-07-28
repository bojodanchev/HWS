import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Public site shell — marketing and catalogue pages share the full chrome. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
