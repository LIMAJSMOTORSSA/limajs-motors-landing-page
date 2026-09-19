import cover2025 from '../../assets/images/newsletters/infolettre-2025-cover.webp';
import cover2026 from '../../assets/images/newsletters/infolettre-2026-cover.webp';
import pdf2025 from '../../assets/Infolettre_LIMAJS_MOTORS_SA_Juin_2025.pdf';
import pdf2026 from '../../assets/documents/Infolettre_LIMAJS_MOTORS_Aout_2026.pdf';

const ReportPreview = () => (
  <section className="bg-[#eee9df] py-20 dark:bg-stone-900 md:py-28">
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div><h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Rapport d&apos;Activité 2023-2024</h2><p className="mt-5 text-lg text-stone-600 dark:text-stone-300">LIMAJS MOTORS SA - L&apos;accès et l&apos;assurance de voyager</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><h3 className="text-2xl font-semibold">Notre mission</h3><p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">Favoriser la mobilité durable des écoliers, des universitaires et des professionnels par des systèmes de transport sécuritaires et accessibles.</p></div>
          <div><h3 className="text-2xl font-semibold">Perspectives 2026</h3><p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">Ouverture de trois nouveaux circuits dans la ville du Cap-Haïtien et lancement du service au grand public.</p></div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <article className="grid bg-white dark:bg-stone-950 sm:grid-cols-[0.8fr_1.2fr]">
          <img src={cover2025} alt="Infolettre LIMAJS MOTORS SA Juin 2025" className="h-full min-h-[420px] w-full object-cover object-top" loading="lazy" />
          <div className="flex flex-col justify-between p-7 md:p-10"><div><h3 className="text-3xl font-semibold">Réalisations principales</h3><ul className="mt-7 space-y-5 text-stone-600 dark:text-stone-300"><li>Lancement du service de transport à la Cité du Savoir (Oct. 2024)</li><li>Achat d&apos;un bus de 18 places pour assurer l&apos;autonomie du service</li><li>Développement d&apos;applications iOS et Android pour les usagers</li></ul></div><a href={pdf2025} download className="mt-10 inline-flex bg-primary px-5 py-3 text-center font-semibold text-white hover:bg-primary-dark">Télécharger l&apos;infolettre 2025 (PDF)</a></div>
        </article>
        <article className="grid bg-secondary text-white sm:grid-cols-[0.8fr_1.2fr]">
          <img src={cover2026} alt="Infolettre LIMAJS MOTORS SA Août 2026" className="h-full min-h-[420px] w-full object-cover object-top" loading="lazy" />
          <div className="flex flex-col justify-between p-7 md:p-10"><div><h3 className="text-3xl font-semibold">Perspectives 2026</h3><p className="mt-7 leading-relaxed text-white/80">Ouverture de trois nouveaux circuits dans la ville du Cap-Haïtien et lancement du service au grand public.</p></div><a href={pdf2026} download className="mt-10 inline-flex border border-white px-5 py-3 text-center font-semibold text-white hover:bg-white hover:text-secondary">Télécharger l&apos;infolettre 2026 (PDF)</a></div>
        </article>
      </div>
    </div>
  </section>
);

export default ReportPreview;
