import { AlertCircle } from "lucide-react";

const problems = [
  "Tidak bisa cuti kerja untuk antri RS",
  "Orang tua harus kontrol sendirian",
  "Bingung urus administrasi BPJS & surat rujukan",
  "Datang dari luar kota tanpa keluarga di sini",
];

const ProblemSection = () => {
  return (
    <section className="py-16 md:py-24 section-alt">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-10">
            Apakah Anda Mengalami Ini?
          </h2>

          <div className="grid gap-4 mb-10">
            {problems.map((problem) => (
              <div
                key={problem}
                className="flex items-center gap-4 bg-card rounded-xl p-5 shadow-sm border border-border text-left"
              >
                <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                <p className="text-base md:text-lg text-foreground font-medium">{problem}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/20">
            <p className="text-xl md:text-2xl font-bold text-primary">
              Tenang. Kami hadir sebagai solusi terpercaya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
