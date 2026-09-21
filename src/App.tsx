import { ReleaseProvider } from "./ReleaseContext";
import { CursorDownload } from "./sections/CursorDownload";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";

export function App() {
  return (
    <ReleaseProvider>
      <Hero />
      <CursorDownload />
      <Footer />
    </ReleaseProvider>
  );
}
