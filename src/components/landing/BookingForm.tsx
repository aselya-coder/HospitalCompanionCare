import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle } from "lucide-react";
import { getLandingData, formatCurrency, generateWhatsAppUrl } from "@/lib/landing-data";
import { toast } from "sonner";

const BookingForm = () => {
  const data = getLandingData();

  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [rumahSakit, setRumahSakit] = useState("");
  const [kota, setKota] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [estimasiJam, setEstimasiJam] = useState(1);
  const [pendamping, setPendamping] = useState("");
  const [catatan, setCatatan] = useState("");

  const estimasiBiaya = useMemo(() => data.pricePerHour * estimasiJam, [estimasiJam, data.pricePerHour]);

  const isValid = nama.trim() && hp.trim() && rumahSakit.trim() && kota && tanggal && pendamping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      toast.error("Mohon lengkapi semua data yang bertanda bintang (*)");
      return;
    }

    const url = generateWhatsAppUrl(data, {
      nama: nama.trim(),
      hp: hp.trim(),
      rumahSakit: rumahSakit.trim(),
      kota,
      tanggal,
      estimasiJam,
      pendamping,
      catatan: catatan.trim(),
    });

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
                    {data.cities.map((city) => (
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
                  <p className="text-xs text-muted-foreground">{formatCurrency(data.pricePerHour)} × {estimasiJam} jam</p>
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
