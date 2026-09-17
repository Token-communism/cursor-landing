import { ReleaseProvider } from "./ReleaseContext";
import { Demo } from "./sections/Demo";
import { DownloadCta } from "./sections/DownloadCta";
import { Faq } from "./sections/Faq";
import { Features } from "./sections/Features";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { HowItWorks } from "./sections/HowItWorks";
import { QuickStart } from "./sections/QuickStart";

export function App() {
  return (
    <ReleaseProvider>
      <a className="skip" href="#demo">
        跳到产品演示
      </a>
      <Hero />
      <main>
        <Demo />
        <Features />
        <HowItWorks />
        <QuickStart />
        <Faq />
        <DownloadCta />
      </main>
      <Footer />
    </ReleaseProvider>
  );
}
