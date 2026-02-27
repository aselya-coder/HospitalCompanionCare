import { Button } from "@/components/ui/button";
import { Shield, Clock, Zap, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const badges = [
  { icon: Clock, text: "Respon Cepat < 5 Menit" },
  { icon: Shield, text: "Aman & Terpercaya" },
  { icon: Zap, text: "Bisa Mendadak" },
  { icon: MapPin, text: "Tersedia di Berbagai Kota" },
];

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Pendamping rumah sakit profesional membantu pasien" className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-2xl text-primary-foreground">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            Tak Bisa Menemani Keluarga di Rumah Sakit?{" "}
            <span className="block mt-2 text-accent">Kami Siap Menggantikan Anda.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Pendamping profesional untuk antri, administrasi, kontrol, IGD, hingga tebus obat.{" "}
            <strong>Layanan per jam. Bisa pilih pria atau wanita.</strong>
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {badges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm md:text-base">
                <badge.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/90">{badge.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" onClick={scrollToForm} className="w-full sm:w-auto">
              PESAN PENDAMPING SEKARANG
            </Button>
            <p className="mt-3 text-sm text-primary-foreground/70 urgency-text font-semibold">
              ⚡ Slot terbatas setiap hari.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
