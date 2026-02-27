import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const CTASection = () => {
  const scrollToForm = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="hero-gradient rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">
            Jangan Biarkan Orang Tua Anda Sendirian di Rumah Sakit.
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Pesan pendamping profesional sekarang. Kami siap membantu kapan saja.
          </p>
          <Button variant="hero" size="xl" onClick={scrollToForm}>
            <MessageCircle className="w-5 h-5" />
            Pesan Sekarang via WhatsApp
          </Button>
          <p className="mt-4 text-primary-foreground/60 text-sm">
            Admin online setiap hari. Respon cepat & ramah.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
