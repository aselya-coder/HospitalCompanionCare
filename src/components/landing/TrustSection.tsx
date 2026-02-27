import { useEffect, useState } from "react";
import { Star, Users, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

const TrustSection = () => {
  const [totalServed, setTotalServed] = useState<number>(300);
  const [heading, setHeading] = useState<string>("Lebih dari 300+ Keluarga Sudah Mempercayakan Kami");
  const [testimonials, setTestimonials] = useState<{ name: string; text: string; rating: number; role: string }[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (mounted && settings?.total_served != null) {
        setTotalServed(settings.total_served);
        setHeading(`Lebih dari ${settings.total_served}+ Keluarga Sudah Mempercayakan Kami`);
      }
      const { data: trustCfg } = await supabase.from("trust_section_settings").select("*").limit(1).maybeSingle();
      if (mounted && trustCfg?.heading) setHeading(trustCfg.heading.replace("{total}", String(settings?.total_served ?? 300)));
      const { data: testi } = await supabase
        .from("testimonials")
        .select("name, text, rating, role, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (mounted && testi) setTestimonials(testi);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24" id="testimoni">
      <div className="container">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-14">
          <div className="text-center p-6 rounded-2xl trust-bg">
            <Users className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl md:text-4xl font-extrabold text-foreground">{totalServed}+</p>
            <p className="text-sm text-muted-foreground">Keluarga Terlayani</p>
          </div>
          <div className="text-center p-6 rounded-2xl trust-bg">
            <Star className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl md:text-4xl font-extrabold text-foreground">4.9</p>
            <p className="text-sm text-muted-foreground">Rating Kepuasan</p>
          </div>
          <div className="text-center p-6 rounded-2xl trust-bg">
            <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-3xl md:text-4xl font-extrabold text-foreground">100%</p>
            <p className="text-sm text-muted-foreground">Aman & Terpercaya</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            {heading}
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-12 text-center p-8 rounded-2xl trust-bg border border-accent/20">
          <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Garansi Keamanan & Privasi</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Semua pendamping kami terverifikasi dan berpengalaman. Data Anda dijaga kerahasiaannya dengan standar keamanan tinggi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
