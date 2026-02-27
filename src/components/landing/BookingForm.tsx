import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/landing-data";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const BookingForm = () => {
  const [services, setServices] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [pricePerHour, setPricePerHour] = useState<number>(50000);
  const [waPhone, setWaPhone] = useState<string>("6285646420488");

  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [rumahSakit, setRumahSakit] = useState("");
  const [layanan, setLayanan] = useState("");
  const [kota, setKota] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [estimasiJam, setEstimasiJam] = useState(1);
  const [pendamping, setPendamping] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: svc } = await supabase
        .from("services")
        .select("name, sort_order, active")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (mounted && svc) setServices(svc.map((s) => s.name));
      const { data: cts } = await supabase.from("cities").select("name, sort_order, active").eq("active", true).order("sort_order", { ascending: true });
      if (mounted && cts) setCities(cts.map((c) => c.name));
      const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (mounted && settings?.price_per_hour) setPricePerHour(settings.price_per_hour);
      const { data: wa } = await supabase.from("whatsapp_settings").select("*").limit(1).maybeSingle();
      if (mounted && wa?.phone_number) setWaPhone(wa.phone_number);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const estimasiBiaya = useMemo(() => pricePerHour * estimasiJam, [estimasiJam, pricePerHour]);

  const isValid = Boolean(nama.trim() && hp.trim() && rumahSakit.trim() && kota && tanggal && pendamping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!nama.trim()) {
      toast.error("Nama Lengkap harus diisi");
    }
    if (!hp.trim()) {
      toast.error("Nomor HP harus diisi");
      return;
    }
    if (!rumahSakit.trim()) {
      toast.error("Nama Rumah Sakit harus diisi");
      return;
    }
    if (!layanan) {
      toast.error("Jenis Layanan harus dipilih");
      return;
    }
    if (!kota) {
      toast.error("Kota/Kabupaten harus dipilih");
      return;
    }
    if (!tanggal) {
      toast.error("Tanggal harus diisi");
      return;
    }
    if (!pendamping) {
      toast.error("Pilih jenis kelamin pendamping");
      return;
    }

    const payload = {
      name: nama.trim(),
      phone: hp.trim(),
      hospital: rumahSakit.trim(),
      service: layanan,
      city: kota,
      date: tanggal,
      hours: estimasiJam,
      companion_gender: pendamping,
      note: catatan.trim(),
    };
    let saved = false;
    try {
      const { error } = await supabase.from("bookings").insert(payload);
      if (!error) {
        saved = true;
        toast.success("Pemesanan tercatat. Membuka WhatsApp…");
      } else {
        toast.warning("Gagal menyimpan ke sistem. Membuka WhatsApp…");
      }
    } catch (_) {
      toast.warning("Gagal menyimpan ke sistem. Membuka WhatsApp…");
    }

    const message = `Halo Admin, saya ingin memesan jasa pendampingan RS.

Nama: ${payload.name}
No HP: ${payload.phone}
Layanan: ${payload.service}
Rumah Sakit: ${payload.hospital}
Kota: ${payload.city}
Tanggal: ${payload.date}
Estimasi Jam: ${payload.hours} jam
Pendamping: ${payload.companion_gender}
Catatan: ${payload.note || "-"}

Estimasi Biaya: ${formatCurrency(estimasiBiaya)}

Mohon info ketersediaan dan total biaya.`;

    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <section className="py-16 md:py-24 section-alt" id="booking-form">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Pesan Pendamping Sekarang
            </h2>
            <p className="text-muted-foreground text-lg">
              Isi form di bawah, lalu klik tombol WhatsApp untuk langsung terhubung dengan admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input id="nama" placeholder="Nama Anda" value={nama} onChange={(e) => setNama(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hp">Nomor HP *</Label>
                <Input id="hp" placeholder="08xxxxxxxxxx" value={hp} onChange={(e) => setHp(e.target.value)} required maxLength={15} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layanan">Pilih Layanan *</Label>
              <Select value={layanan} onValueChange={setLayanan}>
                <SelectTrigger id="layanan">
                  <SelectValue placeholder="Pilih jenis layanan" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="rs">Rumah Sakit Tujuan *</Label>
                <Input id="rs" placeholder="Nama rumah sakit" value={rumahSakit} onChange={(e) => setRumahSakit(e.target.value)} required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kota">Kota / Kabupaten *</Label>
                <Select value={kota} onValueChange={setKota}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal *</Label>
                <Input id="tanggal" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jam">Estimasi Jam *</Label>
                <Input id="jam" type="number" min={1} max={24} value={estimasiJam} onChange={(e) => setEstimasiJam(Math.max(1, parseInt(e.target.value) || 1))} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pilih Pendamping *</Label>
              <div className="grid grid-cols-2 gap-3">
                {["Laki-laki", "Perempuan"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPendamping(option)}
                    className={`rounded-xl border-2 p-4 text-center font-semibold transition-all ${
                      pendamping === option
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {option === "Laki-laki" ? "👨" : "👩"} {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan</Label>
              <Textarea id="catatan" placeholder="Detail kebutuhan Anda..." value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} maxLength={500} />
            </div>

            {/* Estimasi Biaya */}
            <div className="rounded-xl bg-primary/5 border-2 border-primary/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Estimasi Biaya</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(pricePerHour)} × {estimasiJam} jam</p>
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-primary">
                  {formatCurrency(estimasiBiaya)}
                </p>
              </div>
            </div>

            <Button type="submit" variant="wa" size="xl" className="w-full">
              <MessageCircle className="w-5 h-5" />
              Pesan via WhatsApp
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Data Anda aman dan hanya digunakan untuk pemesanan.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
