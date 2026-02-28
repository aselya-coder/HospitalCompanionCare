import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLandingData, type LandingData } from "@/lib/landing-data";
import { ArrowLeft, Save, Plus, Trash2, LayoutDashboard, Navigation, Menu, Cog, MapPin, ClipboardList, HelpCircle, Megaphone, Phone, MessageSquareText, Footprints, Shield, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const DEFAULT_FAQS = [
  { q: "Apakah bisa mendadak / hari yang sama?", a: "Ya, kami menerima pemesanan mendadak! Selama ada slot tersedia, pendamping bisa hadir dalam waktu kurang dari 1 jam. Segera hubungi kami via WhatsApp untuk konfirmasi ketersediaan." },
  { q: "Apakah aman menggunakan jasa ini?", a: "Sangat aman. Semua pendamping kami sudah melalui proses verifikasi identitas, pelatihan, dan memiliki pengalaman di lingkungan rumah sakit. Kami juga menjamin privasi data Anda." },
  { q: "Bagaimana sistem pembayaran?", a: "Pembayaran dilakukan setelah layanan selesai melalui transfer bank. Harga dihitung per jam dengan tarif yang sudah disepakati di awal. Tidak ada biaya tersembunyi." },
  { q: "Apakah tersedia 24 jam?", a: "Ya, layanan kami tersedia 24 jam termasuk hari libur dan tanggal merah. Untuk pemesanan di luar jam kerja, silakan WhatsApp admin dan kami akan segera merespons." },
  { q: "Bagaimana jika butuh lebih lama dari estimasi?", a: "Jika durasi melebihi estimasi, Anda cukup menghubungi admin untuk konfirmasi perpanjangan. Biaya tambahan dihitung per jam sesuai tarif yang berlaku." },
  { q: "Apakah bisa memilih pendamping pria atau wanita?", a: "Tentu! Saat mengisi form pemesanan, Anda bisa memilih pendamping laki-laki atau perempuan sesuai kebutuhan dan kenyamanan Anda." },
];

// Flag untuk mendeteksi apakah ini adalah reload halaman pertama kali
// Variabel di luar komponen tidak akan reset saat navigasi internal, hanya saat reload browser
let isInitialReload = true;

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LandingData>(getLandingData());
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [brand, setBrand] = useState("PendampingRS");
  const [navbarLinks, setNavbarLinks] = useState<Array<{ label: string; href: string }>>([
    { label: "Layanan", href: "#layanan" },
    { label: "Testimoni", href: "#testimoni" },
    { label: "FAQ", href: "#faq" },
  ]);
  const [heroTitle, setHeroTitle] = useState("Tak Bisa Menemani Keluarga di Rumah Sakit?");
  const [heroHighlight, setHeroHighlight] = useState("Kami Siap Menggantikan Anda.");
  const [heroDescription, setHeroDescription] = useState(
    "Pendamping profesional untuk antri, administrasi, kontrol, IGD, hingga tebus obat. Layanan per jam. Bisa pilih pria atau wanita.",
  );
  const [heroButtonText, setHeroButtonText] = useState("PESAN PENDAMPING SEKARANG");
  const [heroUrgencyText, setHeroUrgencyText] = useState("⚡ Slot terbatas setiap hari.");
  const [problemHeading, setProblemHeading] = useState("Apakah Anda Mengalami Ini?");
  const [problemBottomText, setProblemBottomText] = useState("Tenang. Kami hadir sebagai solusi terpercaya.");
  const [problems, setProblems] = useState<string[]>([
    "Tidak bisa cuti kerja untuk antri RS",
    "Orang tua harus kontrol sendirian",
    "Bingung urus administrasi BPJS & surat rujukan",
    "Datang dari luar kota tanpa keluarga di sini",
  ]);
  const [faqHeading, setFaqHeading] = useState("Pertanyaan yang Sering Diajukan");
  const [faqs, setFaqs] = useState<Array<{ q: string; a: string }>>(DEFAULT_FAQS);
  const [ctaHeading, setCtaHeading] = useState("Jangan Biarkan Orang Tua Anda Sendirian di Rumah Sakit.");
  const [ctaSubheading, setCtaSubheading] = useState("Pesan pendamping profesional sekarang. Kami siap membantu kapan saja.");
  const [ctaButtonText, setCtaButtonText] = useState("Pesan Sekarang via WhatsApp");
  const [ctaSmallText, setCtaSmallText] = useState("Admin online setiap hari. Respon cepat & ramah.");
  const [waDefaultMessage, setWaDefaultMessage] = useState("Halo, saya ingin bertanya tentang jasa pendampingan rumah sakit.");
  const [footerTagline, setFooterTagline] = useState("Jasa pendamping rumah sakit profesional, terpercaya, dan siap kapan saja.");
  const [bookings, setBookings] = useState<
    Array<{ id: string; created_at: string; name: string; phone: string; hospital: string; service: string; city: string; date: string; hours: number; companion_gender: string; note: string | null }>
  >([]);
  const [trustHeading, setTrustHeading] = useState("Lebih dari 300+ Keluarga Sudah Mempercayakan Kami");
  const [trustPoints, setTrustPoints] = useState<Array<{ text: string; icon: string }>>([
    { text: "Respon Cepat < 5 Menit", icon: "Clock" },
    { text: "Aman & Terpercaya", icon: "Shield" },
    { text: "Bisa Mendadak", icon: "Zap" },
    { text: "Tersedia di Berbagai Kota", icon: "MapPin" },
  ]);
  const [servicesTitle, setServicesTitle] = useState("Layanan Kami");
  const [servicesSubtitle, setServicesSubtitle] = useState("Pilih layanan yang Anda butuhkan");
  const [active, setActive] = useState<
    | "dashboard"
    | "navbar"
    | "hero"
    | "problems"
    | "general"
    | "cities"
    | "services"
    | "faq"
    | "cta"
    | "whatsapp"
    | "footer"
    | "testimonials"
    | "trust"
    | "bookings"
  >("dashboard");

  const save = () => {
    const run = async () => {
      await supabase.from("site_settings").upsert({ id: 1, price_per_hour: data.pricePerHour, total_served: data.totalServed });
      await supabase.from("whatsapp_settings").upsert({ id: 1, phone_number: data.whatsappNumber, default_message: waDefaultMessage });

      await supabase.from("navbar").upsert({ id: 1, brand_name: brand });
      if (navbarLinks.length) {
        await supabase.from("navbar_links").delete().neq("id", -1);
        await supabase
          .from("navbar_links")
          .insert(navbarLinks.map((l, i) => ({ label: l.label, href: l.href, sort_order: i, active: true })));
      }

      await supabase
        .from("hero_section")
        .upsert({ id: 1, title: heroTitle, highlight: heroHighlight, description: heroDescription, button_text: heroButtonText, urgency_text: heroUrgencyText });

      await supabase.from("problem_section_settings").upsert({ id: 1, heading: problemHeading, bottom_text: problemBottomText });
      if (problems.length) {
        await supabase.from("problems").delete().neq("id", -1);
        await supabase.from("problems").insert(problems.map((text, i) => ({ text, sort_order: i, active: true })));
      }

      await supabase.from("faq_section_settings").upsert({ id: 1, heading: faqHeading });
      if (faqs.length) {
        await supabase.from("faqs").delete().neq("id", -1);
        await supabase.from("faqs").insert(faqs.map((f, i) => ({ question: f.q, answer: f.a, sort_order: i, active: true })));
      }

      await supabase
        .from("services_section_settings")
        .upsert({ id: 1, title: servicesTitle, subtitle: servicesSubtitle });

      await supabase
        .from("cta_section")
        .upsert({ id: 1, heading: ctaHeading, subheading: ctaSubheading, button_text: ctaButtonText, small_text: ctaSmallText });

      await supabase.from("footer").upsert({ id: 1, tagline: footerTagline });

      await supabase.from("trust_section_settings").upsert({ id: 1, heading: trustHeading });
      if (trustPoints.length) {
        await supabase.from("trust_points").delete().neq("id", -1);
        await supabase.from("trust_points").insert(
          trustPoints.map((p, i) => ({ text: p.text, icon: p.icon, sort_order: i, active: true })),
        );
      }

      if (data.cities.length) {
        await supabase.from("cities").delete().neq("id", -1);
        await supabase.from("cities").insert(data.cities.map((name, i) => ({ name, sort_order: i, active: true })));
      }
      if (data.services.length) {
        await supabase.from("services").delete().neq("id", -1);
        await supabase
          .from("services")
          .insert(data.services.map((s, i) => ({ name: s.name, description: s.description, icon: s.icon, sort_order: i, active: true })));
      }
      if (data.testimonials.length) {
        await supabase.from("testimonials").delete().neq("id", -1);
        await supabase.from("testimonials").insert(
          data.testimonials.map((t, i) => ({ name: t.name, text: t.text, rating: t.rating, role: t.role, sort_order: i, active: true })),
        );
      }
      toast.success("Data berhasil disimpan!");
    };
    run();
  };

  const updateField = <K extends keyof LandingData>(key: K, value: LandingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Login gagal");
    } else {
      setSignedIn(true);
      setUserEmail(email);
      toast.success("Login berhasil");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSignedIn(false);
    setUserEmail("");
    toast.success("Logout berhasil");
  };

  const autoSeeded = useRef(false);
  const seedFromWebsite = async () => {
    const defaults = getLandingData();
    const defaultNavbarLinks = [
      { label: "Layanan", href: "#layanan" },
      { label: "Testimoni", href: "#testimoni" },
      { label: "FAQ", href: "#faq" },
    ];
    const defaultProblems = [
      "Tidak bisa cuti kerja untuk antri RS",
      "Orang tua harus kontrol sendirian",
      "Bingung urus administrasi BPJS & surat rujukan",
      "Datang dari luar kota tanpa keluarga di sini",
    ];
    const defaultFaqs = [
      { q: "Apakah bisa mendadak / hari yang sama?", a: "Ya, kami menerima pemesanan mendadak! Selama ada slot tersedia, pendamping bisa hadir dalam waktu kurang dari 1 jam. Segera hubungi kami via WhatsApp untuk konfirmasi ketersediaan." },
      { q: "Apakah aman menggunakan jasa ini?", a: "Sangat aman. Semua pendamping kami sudah melalui proses verifikasi identitas, pelatihan, dan memiliki pengalaman di lingkungan rumah sakit. Kami juga menjamin privasi data Anda." },
      { q: "Bagaimana sistem pembayaran?", a: "Pembayaran dilakukan setelah layanan selesai melalui transfer bank. Harga dihitung per jam dengan tarif yang sudah disepakati di awal. Tidak ada biaya tersembunyi." },
      { q: "Apakah tersedia 24 jam?", a: "Ya, layanan kami tersedia 24 jam termasuk hari libur dan tanggal merah. Untuk pemesanan di luar jam kerja, silakan WhatsApp admin dan kami akan segera merespons." },
      { q: "Bagaimana jika butuh lebih lama dari estimasi?", a: "Jika durasi melebihi estimasi, Anda cukup menghubungi admin untuk konfirmasi perpanjangan. Biaya tambahan dihitung per jam sesuai tarif yang berlaku." },
      { q: "Apakah bisa memilih pendamping pria atau wanita?", a: "Tentu! Saat mengisi form pemesanan, Anda bisa memilih pendamping laki-laki atau perempuan sesuai kebutuhan dan kenyamanan Anda." },
    ];
    const defaultTrustHeading = "Lebih dari {total}+ Keluarga Sudah Mempercayakan Kami";
    const defaultTrustPoints = [
      { text: "Respon Cepat < 5 Menit", icon: "Clock" },
      { text: "Aman & Terpercaya", icon: "Shield" },
      { text: "Bisa Mendadak", icon: "Zap" },
      { text: "Tersedia di Berbagai Kota", icon: "MapPin" },
    ];
    await supabase.from("site_settings").upsert({ id: 1, price_per_hour: defaults.pricePerHour, total_served: defaults.totalServed });
    await supabase.from("whatsapp_settings").upsert({ id: 1, phone_number: defaults.whatsappNumber, default_message: "Halo, saya ingin bertanya tentang jasa pendampingan rumah sakit." });
    await supabase.from("navbar").upsert({ id: 1, brand_name: "PendampingRS" });
    await supabase.from("navbar_links").delete().neq("id", -1);
    await supabase.from("navbar_links").insert(defaultNavbarLinks.map((l, i) => ({ ...l, sort_order: i, active: true })));
    await supabase.from("hero_section").upsert({
      id: 1,
      title: "Tak Bisa Menemani Keluarga di Rumah Sakit?",
      highlight: "Kami Siap Menggantikan Anda.",
      description: "Pendamping profesional untuk antri, administrasi, kontrol, IGD, hingga tebus obat. Layanan per jam. Bisa pilih pria atau wanita.",
      button_text: "PESAN PENDAMPING SEKARANG",
      urgency_text: "⚡ Slot terbatas setiap hari.",
    });
    await supabase.from("services_section_settings").upsert({ id: 1, title: "Layanan Kami", subtitle: "Pilih layanan yang Anda butuhkan" });
    await supabase.from("problem_section_settings").upsert({ id: 1, heading: "Apakah Anda Mengalami Ini?", bottom_text: "Tenang. Kami hadir sebagai solusi terpercaya." });
    await supabase.from("problems").delete().neq("id", -1);
    await supabase.from("problems").insert(defaultProblems.map((text, i) => ({ text, sort_order: i, active: true })));
    await supabase.from("faqs").delete().neq("id", -1);
    await supabase.from("faqs").insert(defaultFaqs.map((f, i) => ({ question: f.q, answer: f.a, sort_order: i, active: true })));
    await supabase.from("faq_section_settings").upsert({ id: 1, heading: "Pertanyaan yang Sering Diajukan" });
    await supabase.from("trust_section_settings").upsert({ id: 1, heading: defaultTrustHeading });
    await supabase.from("trust_points").delete().neq("id", -1);
    await supabase.from("trust_points").insert(defaultTrustPoints.map((p, i) => ({ text: p.text, icon: p.icon, sort_order: i, active: true })));
    await supabase.from("cities").delete().neq("id", -1);
    await supabase.from("cities").insert(defaults.cities.map((name, i) => ({ name, sort_order: i, active: true })));
    await supabase.from("services").delete().neq("id", -1);
    await supabase.from("services").insert(defaults.services.map((s, i) => ({ name: s.name, description: s.description, icon: s.icon, sort_order: i, active: true })));
    await supabase.from("testimonials").delete().neq("id", -1);
    await supabase.from("testimonials").insert(defaults.testimonials.map((t, i) => ({ name: t.name, text: t.text, rating: t.rating, role: t.role, sort_order: i, active: true })));
    setBrand("PendampingRS");
    setNavbarLinks(defaultNavbarLinks);
    setHeroTitle("Tak Bisa Menemani Keluarga di Rumah Sakit?");
    setHeroHighlight("Kami Siap Menggantikan Anda.");
    setHeroDescription("Pendamping profesional untuk antri, administrasi, kontrol, IGD, hingga tebus obat. Layanan per jam. Bisa pilih pria atau wanita.");
    setHeroButtonText("PESAN PENDAMPING SEKARANG");
    setHeroUrgencyText("⚡ Slot terbatas setiap hari.");
    setProblemHeading("Apakah Anda Mengalami Ini?");
    setProblemBottomText("Tenang. Kami hadir sebagai solusi terpercaya.");
    setProblems(defaultProblems);
    setFaqHeading("Pertanyaan yang Sering Diajukan");
    setFaqs(defaultFaqs);
    setServicesTitle("Layanan Kami");
    setServicesSubtitle("Pilih layanan yang Anda butuhkan");
    setTrustHeading(defaultTrustHeading);
    setTrustPoints(defaultTrustPoints);
    setData((prev) => ({
      ...prev,
      pricePerHour: defaults.pricePerHour,
      totalServed: defaults.totalServed,
      whatsappNumber: defaults.whatsappNumber,
      cities: defaults.cities,
      services: defaults.services,
      testimonials: defaults.testimonials,
    }));
    localStorage.setItem("seeded-from-website-v1", "1");
    toast.success("Konten berhasil diisi sesuai website");
  };

  // Tambahkan Inactivity Timer (2 jam)
  useEffect(() => {
    if (!signedIn) return;

    let timeoutId: NodeJS.Timeout;
    const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 Jam

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        signOut();
        toast.info("Sesi berakhir karena tidak ada aktivitas");
      }, INACTIVITY_LIMIT);
    };

    // Dengarkan aktivitas user
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [signedIn]);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      // Jika ini adalah reload halaman (F5 atau buka tab baru)
      if (isInitialReload) {
        await supabase.auth.signOut();
        isInitialReload = false;
        if (mounted) {
          setSessionReady(true);
          setSignedIn(false);
          setUserEmail("");
        }
      } else {
        // Jika navigasi internal (dari Landing ke Admin tanpa reload)
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session) {
            setSignedIn(true);
            setUserEmail(session.user.email ?? "");
          }
          setSessionReady(true);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    
    let mounted = true;
    const load = async () => {
      const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      const { data: wa } = await supabase.from("whatsapp_settings").select("*").limit(1).maybeSingle();
      const { data: nb } = await supabase.from("navbar").select("*").limit(1).maybeSingle();
      const { data: nbl } = await supabase
        .from("navbar_links")
        .select("label, href, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const { data: hero } = await supabase.from("hero_section").select("*").limit(1).maybeSingle();
      const { data: prSet } = await supabase.from("problem_section_settings").select("*").limit(1).maybeSingle();
      const { data: prList } = await supabase
        .from("problems")
        .select("text, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const { data: cts } = await supabase.from("cities").select("name, sort_order, active").eq("active", true).order("sort_order", { ascending: true });
      const { data: svc } = await supabase
        .from("services")
        .select("name, description, icon, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const { data: svcSet } = await supabase.from("services_section_settings").select("*").limit(1).maybeSingle();
      const { data: testi } = await supabase
        .from("testimonials")
        .select("name, text, rating, role, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const { data: faqSet } = await supabase.from("faq_section_settings").select("*").limit(1).maybeSingle();
      const { data: faqList } = await supabase
        .from("faqs")
        .select("question, answer, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      const { data: cta } = await supabase.from("cta_section").select("*").limit(1).maybeSingle();
      const { data: ft } = await supabase.from("footer").select("*").limit(1).maybeSingle();
      const { data: bks } = await supabase
        .from("bookings")
        .select("id, created_at, name, phone, hospital, service, city, date, hours, companion_gender, note")
        .order("created_at", { ascending: false })
        .limit(50);
      const { data: trustSet } = await supabase.from("trust_section_settings").select("*").limit(1).maybeSingle();
      const { data: tp } = await supabase
        .from("trust_points")
        .select("text, icon, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (!mounted) return;
      setData((prev) => {
        const cities = cts && cts.length ? cts.map((c) => c.name) : prev.cities;
        const services =
          svc && svc.length ? svc.map((s) => ({ name: s.name, icon: s.icon, description: s.description })) : prev.services;
        const testimonials =
          testi && testi.length
            ? testi.map((t) => ({ name: t.name, text: t.text, rating: t.rating ?? 5, role: t.role ?? "" }))
            : prev.testimonials;
        return {
          ...prev,
          pricePerHour: settings?.price_per_hour ?? prev.pricePerHour,
          totalServed: settings?.total_served ?? prev.totalServed,
          whatsappNumber: wa?.phone_number ?? prev.whatsappNumber,
          cities,
          services,
          testimonials,
        };
      });
      setBrand(nb?.brand_name ?? "PendampingRS");
      if (nbl && nbl.length) setNavbarLinks(nbl.map((l) => ({ label: l.label, href: l.href })));
      setHeroTitle(hero?.title ?? heroTitle);
      setHeroHighlight(hero?.highlight ?? heroHighlight);
      setHeroDescription(hero?.description ?? heroDescription);
      setHeroButtonText(hero?.button_text ?? heroButtonText);
      setHeroUrgencyText(hero?.urgency_text ?? heroUrgencyText);
      setProblemHeading(prSet?.heading ?? problemHeading);
      setProblemBottomText(prSet?.bottom_text ?? problemBottomText);
      if (prList && prList.length) setProblems(prList.map((p) => p.text));
      setFaqHeading(faqSet?.heading ?? faqHeading);
      if (faqList && faqList.length) setFaqs(faqList.map((f) => ({ q: f.question, a: f.answer })));
      setCtaHeading(cta?.heading ?? ctaHeading);
      setCtaSubheading(cta?.subheading ?? ctaSubheading);
      setCtaButtonText(cta?.button_text ?? ctaButtonText);
      setCtaSmallText(cta?.small_text ?? ctaSmallText);
      setWaDefaultMessage(wa?.default_message ?? waDefaultMessage);
      setFooterTagline(ft?.tagline ?? footerTagline);
      setBookings(bks ?? []);
      setServicesTitle(svcSet?.title ?? servicesTitle);
      setServicesSubtitle(svcSet?.subtitle ?? servicesSubtitle);
      setTrustHeading(trustSet?.heading ?? trustHeading);
      if (tp && tp.length) setTrustPoints(tp.map((x) => ({ text: x.text, icon: x.icon || "Clock" })));
      const shouldSeed =
        (!cts || cts.length === 0) &&
        (!svc || svc.length === 0) &&
        (!testi || testi.length === 0) &&
        (!prList || prList.length === 0) &&
        (!faqList || faqList.length === 0) &&
        (!tp || tp.length === 0) &&
        !localStorage.getItem("seeded-from-website-v1");
      if (shouldSeed && !autoSeeded.current) {
        autoSeeded.current = true;
        await seedFromWebsite();
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [signedIn]);

  if (!sessionReady) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat...</div>;
  }

  if (!signedIn) {
    return (
      <div className="uplift min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card rounded-2xl p-6 border border-border w-full max-w-[360px] space-y-4 shadow-sm">
          <h1 className="text-foreground font-bold text-lg text-center">Admin Login</h1>
          <form onSubmit={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="p-2 text-sm font-semibold">Admin HospitalCompanionCare</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "dashboard"} onClick={() => setActive("dashboard")}>
                  <LayoutDashboard /> <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "navbar"} onClick={() => setActive("navbar")}>
                  <Navigation /> <span>Navbar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "hero"} onClick={() => setActive("hero")}>
                  <Menu /> <span>Hero</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "problems"} onClick={() => setActive("problems")}>
                  <HelpCircle /> <span>Problems</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "general"} onClick={() => setActive("general")}>
                  <Cog /> <span>General</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "cities"} onClick={() => setActive("cities")}>
                  <MapPin /> <span>Cities</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "services"} onClick={() => setActive("services")}>
                  <ClipboardList /> <span>Services</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "testimonials"} onClick={() => setActive("testimonials")}>
                  <MessageSquareText /> <span>Testimonials</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "faq"} onClick={() => setActive("faq")}>
                  <HelpCircle /> <span>FAQ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "cta"} onClick={() => setActive("cta")}>
                  <Megaphone /> <span>CTA</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "whatsapp"} onClick={() => setActive("whatsapp")}>
                  <Phone /> <span>WhatsApp</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "footer"} onClick={() => setActive("footer")}>
                  <Footprints /> <span>Footer</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "trust"} onClick={() => setActive("trust")}>
                  <Shield /> <span>Trust</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={active === "bookings"} onClick={() => setActive("bookings")}>
                  <ClipboardList /> <span>Bookings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="container px-4 flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <SidebarTrigger />
              <button 
                onClick={() => navigate("/")} 
                className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
              <h1 className="font-bold text-foreground capitalize truncate ml-1">{active}</h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-muted-foreground leading-none mb-0.5">Logged in as</span>
                <span className="text-xs font-medium text-foreground leading-none">{userEmail}</span>
              </div>
              
              <Button variant="outline" size="icon" className="sm:hidden" onClick={signOut}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={signOut}>
                Logout
              </Button>

              <Button variant="outline" size="icon" onClick={() => seedFromWebsite()} title="Isi dari Website">
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Button onClick={save} size="sm" className="hidden sm:flex">
                <Save className="w-4 h-4" /> Simpan
              </Button>
              <Button onClick={save} size="icon" className="sm:hidden">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container px-4 py-6 sm:py-8 max-w-3xl space-y-8">
          {active === "dashboard" && (
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-6 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-3xl font-extrabold text-foreground">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Bookings</p>
              </div>
              <div className="text-center p-6 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-3xl font-extrabold text-foreground">{data.services.length}</p>
                <p className="text-sm text-muted-foreground">Services</p>
              </div>
              <div className="text-center p-6 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-3xl font-extrabold text-foreground">{faqs.length}</p>
                <p className="text-sm text-muted-foreground">FAQ</p>
              </div>
            </section>
          )}

          {active === "navbar" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Navbar</h2>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Links</Label>
                <Button size="sm" variant="outline" onClick={() => setNavbarLinks([...navbarLinks, { label: "", href: "" }])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              {navbarLinks.map((l, i) => (
                <div key={i} className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto] gap-2 p-3 border border-border/50 rounded-xl sm:p-0 sm:border-0">
                  <Input placeholder="Label" value={l.label} onChange={(e) => {
                    const arr = [...navbarLinks]; arr[i] = { ...arr[i], label: e.target.value }; setNavbarLinks(arr);
                  }} />
                  <Input placeholder="Href" value={l.href} onChange={(e) => {
                    const arr = [...navbarLinks]; arr[i] = { ...arr[i], href: e.target.value }; setNavbarLinks(arr);
                  }} />
                  <Button size="icon" variant="ghost" className="self-end sm:self-auto" onClick={() => setNavbarLinks(navbarLinks.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </section>
          )}

          {active === "hero" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Hero</h2>
              <Input placeholder="Judul" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
              <Input placeholder="Highlight" value={heroHighlight} onChange={(e) => setHeroHighlight(e.target.value)} />
              <Textarea placeholder="Deskripsi" value={heroDescription} rows={3} onChange={(e) => setHeroDescription(e.target.value)} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Teks Tombol" value={heroButtonText} onChange={(e) => setHeroButtonText(e.target.value)} />
                <Input placeholder="Teks Urgensi" value={heroUrgencyText} onChange={(e) => setHeroUrgencyText(e.target.value)} />
              </div>
            </section>
          )}

          {active === "problems" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Problems</h2>
              <Input placeholder="Heading" value={problemHeading} onChange={(e) => setProblemHeading(e.target.value)} />
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Daftar Problem</Label>
                <Button size="sm" variant="outline" onClick={() => setProblems([...problems, ""])}><Plus className="w-4 h-4" /> Tambah</Button>
              </div>
              {problems.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={p} onChange={(e) => { const arr = [...problems]; arr[i] = e.target.value; setProblems(arr); }} />
                  <Button size="icon" variant="ghost" className="shrink-0" onClick={() => setProblems(problems.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Textarea placeholder="Bottom Text" value={problemBottomText} rows={2} onChange={(e) => setProblemBottomText(e.target.value)} />
            </section>
          )}

          {active === "general" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Pengaturan Umum</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Harga per Jam (Rp)</Label>
                  <Input type="number" value={data.pricePerHour} onChange={(e) => updateField("pricePerHour", parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Nomor WhatsApp</Label>
                  <Input placeholder="6281234567890" value={data.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Total Pasien Terlayani</Label>
                  <Input type="number" value={data.totalServed} onChange={(e) => updateField("totalServed", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </section>
          )}

          {active === "cities" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-foreground">Kota</h2>
                <Button size="sm" variant="outline" onClick={() => updateField("cities", [...data.cities, ""])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.cities.map((city, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={city} onChange={(e) => {
                      const updated = [...data.cities];
                      updated[i] = e.target.value;
                      updateField("cities", updated);
                    }} />
                    <Button size="icon" variant="ghost" onClick={() => updateField("cities", data.cities.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {active === "services" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-foreground">Layanan</h2>
                <Button size="sm" variant="outline" onClick={() => updateField("services", [...data.services, { name: "", icon: "ClipboardList", description: "" }])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Judul Section" value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} />
                <Input placeholder="Subjudul Section" value={servicesSubtitle} onChange={(e) => setServicesSubtitle(e.target.value)} />
              </div>
              {data.services.map((service, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Layanan #{i + 1}</Label>
                    <Button size="icon" variant="ghost" onClick={() => updateField("services", data.services.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Input placeholder="Nama layanan" value={service.name} onChange={(e) => {
                    const updated = [...data.services];
                    updated[i] = { ...updated[i], name: e.target.value };
                    updateField("services", updated);
                  }} />
                  <Textarea placeholder="Deskripsi" value={service.description} rows={2} onChange={(e) => {
                    const updated = [...data.services];
                    updated[i] = { ...updated[i], description: e.target.value };
                    updateField("services", updated);
                  }} />
                </div>
              ))}
            </section>
          )}

          {active === "trust" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Trust Section</h2>
              <Input placeholder="Heading" value={trustHeading} onChange={(e) => setTrustHeading(e.target.value)} />
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Trust Points</Label>
                <Button size="sm" variant="outline" onClick={() => setTrustPoints([...trustPoints, { text: "", icon: "Shield" }])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              {trustPoints.map((p, i) => (
                <div key={i} className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto] gap-2 p-3 border border-border/50 rounded-xl sm:p-0 sm:border-0">
                  <Input placeholder="Teks" value={p.text} onChange={(e) => {
                    const arr = [...trustPoints]; arr[i] = { ...arr[i], text: e.target.value }; setTrustPoints(arr);
                  }} />
                  <Input placeholder="Icon (Clock/Shield/Zap/MapPin)" value={p.icon} onChange={(e) => {
                    const arr = [...trustPoints]; arr[i] = { ...arr[i], icon: e.target.value }; setTrustPoints(arr);
                  }} />
                  <Button size="icon" variant="ghost" className="self-end sm:self-auto" onClick={() => setTrustPoints(trustPoints.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </section>
          )}

          {active === "testimonials" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-foreground">Testimoni</h2>
                <Button size="sm" variant="outline" onClick={() => updateField("testimonials", [...data.testimonials, { name: "", text: "", rating: 5, role: "" }])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              {data.testimonials.map((t, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Testimoni #{i + 1}</Label>
                    <Button size="icon" variant="ghost" onClick={() => updateField("testimonials", data.testimonials.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Nama" value={t.name} onChange={(e) => {
                      const updated = [...data.testimonials];
                      updated[i] = { ...updated[i], name: e.target.value };
                      updateField("testimonials", updated);
                    }} />
                    <Input placeholder="Role (Anak Pasien, dll)" value={t.role} onChange={(e) => {
                      const updated = [...data.testimonials];
                      updated[i] = { ...updated[i], role: e.target.value };
                      updateField("testimonials", updated);
                    }} />
                  </div>
                  <Textarea placeholder="Isi testimoni" value={t.text} rows={2} onChange={(e) => {
                    const updated = [...data.testimonials];
                    updated[i] = { ...updated[i], text: e.target.value };
                    updateField("testimonials", updated);
                  }} />
                </div>
              ))}
            </section>
          )}

          {active === "faq" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-foreground">FAQ</h2>
                <Button size="sm" variant="outline" onClick={() => setFaqs([...faqs, { q: "", a: "" }])}>
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Judul Section</Label>
                <Input value={faqHeading} onChange={(e) => setFaqHeading(e.target.value)} />
              </div>
              {faqs.map((f, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3 relative group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <Input placeholder="Pertanyaan" value={f.q} onChange={(e) => {
                        const arr = [...faqs]; arr[i] = { ...arr[i], q: e.target.value }; setFaqs(arr);
                      }} />
                      <Textarea placeholder="Jawaban" rows={2} value={f.a} onChange={(e) => {
                        const arr = [...faqs]; arr[i] = { ...arr[i], a: e.target.value }; setFaqs(arr);
                      }} />
                    </div>
                    <Button size="icon" variant="ghost" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {active === "cta" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">CTA</h2>
              <Input placeholder="Heading" value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} />
              <Textarea placeholder="Subheading" rows={2} value={ctaSubheading} onChange={(e) => setCtaSubheading(e.target.value)} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input placeholder="Teks Tombol" value={ctaButtonText} onChange={(e) => setCtaButtonText(e.target.value)} />
                <Input placeholder="Teks Kecil" value={ctaSmallText} onChange={(e) => setCtaSmallText(e.target.value)} />
              </div>
            </section>
          )}

          {active === "whatsapp" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">WhatsApp</h2>
              <div className="space-y-2">
                <Label>Pesan Default</Label>
                <Textarea rows={2} value={waDefaultMessage} onChange={(e) => setWaDefaultMessage(e.target.value)} />
              </div>
            </section>
          )}

          {active === "footer" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Footer</h2>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Textarea rows={2} value={footerTagline} onChange={(e) => setFooterTagline(e.target.value)} />
              </div>
            </section>
          )}

          {active === "bookings" && (
            <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
              <h2 className="font-bold text-lg text-foreground">Bookings (View Only)</h2>
              <div className="space-y-4">
                {bookings.slice(0, 50).map((b) => (
                  <div key={b.id} className="border border-border rounded-xl p-4 space-y-2 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="font-semibold text-foreground text-sm">{b.name} • {b.phone}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <p><span className="font-medium text-foreground/70">RS:</span> {b.hospital}</p>
                      <p><span className="font-medium text-foreground/70">Kota:</span> {b.city}</p>
                      <p><span className="font-medium text-foreground/70">Tanggal:</span> {b.date}</p>
                      <p><span className="font-medium text-foreground/70">Durasi:</span> {b.hours} jam</p>
                      <p><span className="font-medium text-foreground/70">Layanan:</span> {b.service}</p>
                      <p><span className="font-medium text-foreground/70">Gender:</span> {b.companion_gender}</p>
                    </div>
                    {b.note && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs italic">"{b.note}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
            <Button onClick={save} size="lg" className="w-full sm:w-auto">
              <Save className="w-4 h-4" /> Simpan Semua Perubahan
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Admin;
