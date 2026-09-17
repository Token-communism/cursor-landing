import { ReleaseProvider } from "./ReleaseContext";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";

export function App() {
  return (
    <ReleaseProvider>
      <Hero />
      <Footer />
    </ReleaseProvider>
  );
}
