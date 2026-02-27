import { MessageCircle } from "lucide-react";
import { getLandingData } from "@/lib/landing-data";

const FloatingWhatsApp = () => {
  const data = getLandingData();

  return (
    <a
      href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent("Halo, saya ingin bertanya tentang jasa pendampingan rumah sakit.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-wa flex items-center justify-center shadow-xl animate-pulse-soft hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-8 h-8 text-accent-foreground" />
    </a>
  );
};

export default FloatingWhatsApp;
