import { HeartPulse } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-10 border-t border-border">
      <div className="container text-center">
        <a href="#" className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-4">
          <HeartPulse className="w-5 h-5" />
          PendampingRS
        </a>
        <p className="text-sm text-muted-foreground mb-2">
          Jasa pendamping rumah sakit profesional, terpercaya, dan siap kapan saja.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PendampingRS. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
