import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Footer = () => {
  const [brand, setBrand] = useState("PendampingRS");
  const [tagline, setTagline] = useState("Jasa pendamping rumah sakit profesional, terpercaya, dan siap kapan saja.");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: nav } = await supabase.from("navbar").select("*").limit(1).maybeSingle();
      if (mounted && nav?.brand_name) setBrand(nav.brand_name);
      const { data: ft } = await supabase.from("footer").select("*").limit(1).maybeSingle();
      if (mounted && ft?.tagline) setTagline(ft.tagline);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <footer className="py-10 border-t border-border">
      <div className="container text-center">
        <a href="#" className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-4">
          <HeartPulse className="w-5 h-5" />
          {brand}
        </a>
        <p className="text-sm text-muted-foreground mb-2">
          {tagline}
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {brand}. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
