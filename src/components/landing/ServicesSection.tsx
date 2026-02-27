import { ClipboardList, UserCheck, Siren, FileText, Pill, HeartHandshake } from "lucide-react";
import { getLandingData, formatCurrency } from "@/lib/landing-data";

const iconMap: Record<string, React.ElementType> = {
  ClipboardList, UserCheck, Siren, FileText, Pill, HeartHandshake,
};

const ServicesSection = () => {
  const data = getLandingData();

  return (
    <section className="py-16 md:py-24" id="layanan">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Layanan Kami
          </h2>
          <p className="text-muted-foreground text-lg">
            Pilih layanan yang Anda butuhkan
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service) => {
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
                  Mulai {formatCurrency(data.pricePerHour)} / jam
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
