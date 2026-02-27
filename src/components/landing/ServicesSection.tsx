import { useEffect, useState } from "react";
import { ClipboardList, UserCheck, Siren, FileText, Pill, HeartHandshake } from "lucide-react";
import { formatCurrency } from "@/lib/landing-data";
import { supabase } from "@/lib/supabase";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList, UserCheck, Siren, FileText, Pill, HeartHandshake,
};

const ServicesSection = () => {
  const [services, setServices] = useState<{ name: string; icon: string; description: string }[]>([]);
  const [pricePerHour, setPricePerHour] = useState<number>(50000);
  const [title, setTitle] = useState("Layanan Kami");
  const [subtitle, setSubtitle] = useState("Pilih layanan yang Anda butuhkan");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: svc } = await supabase
        .from("services")
        .select("name, description, icon, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (mounted && svc) setServices(svc);
      const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (mounted && settings?.price_per_hour) setPricePerHour(settings.price_per_hour);
      const { data: svcCfg } = await supabase.from("services_section_settings").select("*").limit(1).maybeSingle();
      if (mounted && svcCfg) {
        if (svcCfg.title) setTitle(svcCfg.title);
        if (svcCfg.subtitle) setSubtitle(svcCfg.subtitle);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-16 md:py-24" id="layanan">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || ClipboardList;
            return (
              <div
                key={service.name}
                className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{service.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <p className="text-primary font-bold text-sm">
                  Mulai {formatCurrency(pricePerHour)} / jam
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
