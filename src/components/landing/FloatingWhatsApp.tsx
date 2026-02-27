import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const FloatingWhatsApp = () => {
  const [phone, setPhone] = useState("6285646420488");
  const [message, setMessage] = useState("Halo, saya ingin bertanya tentang jasa pendampingan rumah sakit.");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: wa } = await supabase.from("whatsapp_settings").select("*").limit(1).maybeSingle();
      if (mounted && wa) {
        if (wa.phone_number) setPhone(wa.phone_number);
        if (wa.default_message) setMessage(wa.default_message);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-wa flex items-center justify-center shadow-xl animate-pulse-soft hover:scale-110 transition-transform"
    >
      <MessageCircle className="w-8 h-8 text-accent-foreground" />
    </a>
  );
};

export default FloatingWhatsApp;
