import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getLandingData, setLandingData, type LandingData } from "@/lib/landing-data";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LandingData>(getLandingData());

  const save = () => {
    setLandingData(data);
    toast.success("Data berhasil disimpan!");
  };

  const updateField = <K extends keyof LandingData>(key: K, value: LandingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <h1 className="font-bold text-foreground">Admin Panel</h1>
          <Button onClick={save} size="sm">
            <Save className="w-4 h-4" /> Simpan
          </Button>
        </div>
      </div>

      <div className="container py-8 max-w-3xl space-y-8">
        {/* General */}
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

        {/* Cities */}
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

        {/* Services */}
        <section className="bg-card rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-foreground">Layanan</h2>
            <Button size="sm" variant="outline" onClick={() => updateField("services", [...data.services, { name: "", icon: "ClipboardList", description: "" }])}>
              <Plus className="w-4 h-4" /> Tambah
            </Button>
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

        {/* Testimonials */}
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

        <div className="text-center pb-8">
          <Button onClick={save} size="lg">
            <Save className="w-4 h-4" /> Simpan Semua Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
