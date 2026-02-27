import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CTASection = () => {
  const [heading, setHeading] = useState("Jangan Biarkan Orang Tua Anda Sendirian di Rumah Sakit.");
  const [subtitle, setSubtitle] = useState("Pesan pendamping profesional sekarang. Kami siap membantu kapan saja.");
  const [buttonText, setButtonText] = useState("Pesan Sekarang via WhatsApp");
  const [smallText, setSmallText] = useState("Admin online setiap hari. Respon cepat & ramah.");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: cta } = await supabase.from("cta_section").select("*").limit(1).maybeSingle();
      if (mounted && cta) {
        if (cta.heading) setHeading(cta.heading);
        if (cta.subheading) setSubtitle(cta.subheading);
        if (cta.button_text) setButtonText(cta.button_text);
        if (cta.small_text) setSmallText(cta.small_text);
      }
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
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="hero-gradient rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-primary-foreground mb-4">
            {heading}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            {subtitle}
          </p>
          <Button variant="hero" size="xl" onClick={scrollToForm}>
            <MessageCircle className="w-5 h-5" />
            {buttonText}
          </Button>
          <p className="mt-4 text-primary-foreground/60 text-sm">
            {smallText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
