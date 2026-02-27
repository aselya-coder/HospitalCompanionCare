import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Apakah bisa mendadak / hari yang sama?",
    a: "Ya, kami menerima pemesanan mendadak! Selama ada slot tersedia, pendamping bisa hadir dalam waktu kurang dari 1 jam. Segera hubungi kami via WhatsApp untuk konfirmasi ketersediaan.",
  },
  {
    q: "Apakah aman menggunakan jasa ini?",
    a: "Sangat aman. Semua pendamping kami sudah melalui proses verifikasi identitas, pelatihan, dan memiliki pengalaman di lingkungan rumah sakit. Kami juga menjamin privasi data Anda.",
  },
  {
    q: "Bagaimana sistem pembayaran?",
    a: "Pembayaran dilakukan setelah layanan selesai melalui transfer bank. Harga dihitung per jam dengan tarif yang sudah disepakati di awal. Tidak ada biaya tersembunyi.",
  },
  {
    q: "Apakah tersedia 24 jam?",
    a: "Ya, layanan kami tersedia 24 jam termasuk hari libur dan tanggal merah. Untuk pemesanan di luar jam kerja, silakan WhatsApp admin dan kami akan segera merespons.",
  },
  {
    q: "Bagaimana jika butuh lebih lama dari estimasi?",
    a: "Jika durasi melebihi estimasi, Anda cukup menghubungi admin untuk konfirmasi perpanjangan. Biaya tambahan dihitung per jam sesuai tarif yang berlaku.",
  },
  {
    q: "Apakah bisa memilih pendamping pria atau wanita?",
    a: "Tentu! Saat mengisi form pemesanan, Anda bisa memilih pendamping laki-laki atau perempuan sesuai kebutuhan dan kenyamanan Anda.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 section-alt" id="faq">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
