import { MessageCircle } from "lucide-react";

const WA_LINK =
  "https://wa.me/6285161220600?text=Assalamu'alaikum, saya ingin konsultasi tentang kelas Tahsin/Tahfizh";

const WhatsAppButton = () => {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
    </a>
  );
};

export default WhatsAppButton;
