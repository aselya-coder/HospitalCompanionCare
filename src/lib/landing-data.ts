export interface ServiceItem {
  name: string;
  icon: string;
  description: string;
}

export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  role: string;
}

export interface LandingData {
  pricePerHour: number;
  whatsappNumber: string;
  cities: string[];
  services: ServiceItem[];
  testimonials: Testimonial[];
  trustBadges: string[];
  totalServed: number;
}

const defaultData: LandingData = {
  pricePerHour: 50000,
  whatsappNumber: "6281234567890",
  totalServed: 300,
  cities: [
    "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang",
    "Medan", "Makassar", "Denpasar", "Malang", "Solo",
    "Bekasi", "Tangerang", "Depok", "Bogor", "Palembang"
  ],
  services: [
    { name: "Antri Pendaftaran", icon: "ClipboardList", description: "Kami antrikan pendaftaran rumah sakit agar Anda tidak perlu menunggu berjam-jam." },
    { name: "Pendamping Rawat Jalan", icon: "UserCheck", description: "Dampingi pasien saat kontrol rutin, konsultasi dokter, dan pemeriksaan." },
    { name: "Pendamping IGD", icon: "Siren", description: "Siap hadir mendampingi di IGD kapan saja, termasuk tengah malam." },
    { name: "Pengurusan Administrasi", icon: "FileText", description: "Urus dokumen, BPJS, surat rujukan, dan administrasi rumah sakit lainnya." },
    { name: "Tebus Obat", icon: "Pill", description: "Antrikan dan tebus resep obat di apotek rumah sakit tanpa Anda harus hadir." },
    { name: "Pendamping Lansia", icon: "HeartHandshake", description: "Pendampingan khusus untuk orang tua yang membutuhkan perhatian ekstra." },
  ],
  testimonials: [
    { name: "Ibu Sari", text: "Sangat terbantu! Orang tua saya harus kontrol rutin tapi saya kerja di luar kota. Pendampingnya ramah dan profesional.", rating: 5, role: "Anak Pasien" },
    { name: "Bapak Hendra", text: "Respon cepat, langsung datang dalam 30 menit. Istri saya yang sedang hamil jadi tidak perlu antri sendiri.", rating: 5, role: "Suami Pasien" },
    { name: "Mbak Dina", text: "Admin sangat membantu koordinasi. Pendamping tiba tepat waktu dan mengurus semua administrasi BPJS.", rating: 5, role: "Keluarga Pasien" },
    { name: "Pak Agus", text: "Dari luar kota dan tidak ada keluarga di Jakarta. Layanan ini benar-benar penyelamat! Sangat recommended.", rating: 5, role: "Pasien Luar Kota" },
    { name: "Ibu Ratna", text: "Sudah 3 kali pakai jasa ini untuk ibu saya yang lansia. Selalu puas dengan pelayanannya. Terima kasih!", rating: 5, role: "Anak Pasien" },
  ],
  trustBadges: [
    "Respon Cepat < 5 Menit",
    "Aman & Terpercaya",
    "Bisa Mendadak",
    "Tersedia di Berbagai Kota",
  ],
};

export function getLandingData(): LandingData {
  try {
    const stored = localStorage.getItem("landing-data");
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch {}
  return defaultData;
}

export function setLandingData(data: LandingData): void {
  localStorage.setItem("landing-data", JSON.stringify(data));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppUrl(data: LandingData, form: {
  nama: string;
  hp: string;
  rumahSakit: string;
  kota: string;
  tanggal: string;
  estimasiJam: number;
  pendamping: string;
  catatan: string;
}): string {
  const total = formatCurrency(data.pricePerHour * form.estimasiJam);
  const message = `Halo Admin, saya ingin memesan jasa pendampingan RS.

Nama: ${form.nama}
No HP: ${form.hp}
Rumah Sakit: ${form.rumahSakit}
Kota: ${form.kota}
Tanggal: ${form.tanggal}
Estimasi Jam: ${form.estimasiJam} jam
Pendamping: ${form.pendamping}
Catatan: ${form.catatan || "-"}

Estimasi Biaya: ${total}

Mohon info ketersediaan dan total biaya.`;

  return `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
