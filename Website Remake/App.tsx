import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { Features } from "./components/Features";
import { BackendStatus } from "./components/BackendStatus";
import { Donation } from "./components/Donation";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <BackendStatus />
        <Donation />
      </main>
      <Footer />
    </div>
  );
}