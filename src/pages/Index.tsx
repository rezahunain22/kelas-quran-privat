import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProgramSection from "@/components/ProgramSection";
import TahfizhDetail from "@/components/TahfizhDetail";
import JadwalSection from "@/components/JadwalSection";
import PricingSection from "@/components/PricingSection";
import PengajarSection from "@/components/PengajarSection";
import CtaSection from "@/components/CtaSection";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProgramSection />
      <TahfizhDetail />
      <JadwalSection />
      <PricingSection />
      <PengajarSection />
      <CtaSection />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
