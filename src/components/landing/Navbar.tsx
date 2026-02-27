import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, HeartPulse } from "lucide-react";

const links = [
  { label: "Layanan", href: "#layanan" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const scrollToForm = () => {
    setOpen(false);
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 text-primary font-bold text-lg">
          <HeartPulse className="w-6 h-6" />
          <span>PendampingRS</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
          <Button variant="wa" size="sm" onClick={scrollToForm}>
            Pesan Sekarang
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-card border-b border-border pb-4">
          <div className="container flex flex-col gap-3">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
                {link.label}
              </a>
            ))}
            <Button variant="wa" size="sm" onClick={scrollToForm}>
              Pesan Sekarang
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
