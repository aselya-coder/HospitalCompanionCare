import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Zap, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, React.ElementType> = { Clock, Shield, Zap, MapPin };

const HeroSection = () => {
  const [title, setTitle] = useState("Tak Bisa Menemani Keluarga di Rumah Sakit?");
  const [highlight, setHighlight] = useState("Kami Siap Menggantikan Anda.");
  const [description, setDescription] = useState(
    "Pendamping profesional untuk antri, administrasi, kontrol, IGD, hingga tebus obat. Layanan per jam. Bisa pilih pria atau wanita."
  );
  const [buttonText, setButtonText] = useState("PESAN PENDAMPING SEKARANG");
  const [urgencyText, setUrgencyText] = useState("⚡ Slot terbatas setiap hari.");
  const [badges, setBadges] = useState<{ text: string; icon?: string }[]>([
    { text: "Respon Cepat < 5 Menit", icon: "Clock" },
    { text: "Aman & Terpercaya", icon: "Shield" },
    { text: "Bisa Mendadak", icon: "Zap" },
    { text: "Tersedia di Berbagai Kota", icon: "MapPin" },
  ]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: hero } = await supabase.from("hero_section").select("*").limit(1).maybeSingle();
      if (mounted && hero) {
        if (hero.title) setTitle(hero.title);
        if (hero.highlight) setHighlight(hero.highlight);
        if (hero.description) setDescription(hero.description);
        if (hero.button_text) setButtonText(hero.button_text);
        if (hero.urgency_text) setUrgencyText(hero.urgency_text);
      }
      const { data: tp } = await supabase
        .from("trust_points")
        .select("text, icon, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (mounted && tp?.length) setBadges(tp);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
            {title}{" "}
            <span className="block mt-2 text-accent">{highlight}</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {description.includes("Layanan per jam") ? (
              <>
                {description.split("Layanan per jam.")[0]}
                <strong>Layanan per jam.</strong>
                {description.split("Layanan per jam.")[1]}
              </>
            ) : (
              description
            )}
          </p>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {badges.map((badge) => {
              const Icon = iconMap[badge.icon || "Clock"] || Clock;
              return (
              <div key={badge.text} className="flex items-center gap-2 text-sm md:text-base">
                <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/90">{badge.text}</span>
              </div>
            )})}
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" onClick={scrollToForm} className="w-full sm:w-auto">
              {buttonText}
            </Button>
            <p className="mt-3 text-sm text-primary-foreground/70 urgency-text font-semibold">
              {urgencyText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
