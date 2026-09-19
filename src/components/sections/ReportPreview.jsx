import cover2025 from '../../assets/images/newsletters/infolettre-2025-cover.webp';
import cover2026 from '../../assets/images/newsletters/infolettre-2026-cover.webp';
import pdf2025 from '../../assets/Infolettre_LIMAJS_MOTORS_SA_Juin_2025.pdf';
import pdf2026 from '../../assets/documents/Infolettre_LIMAJS_MOTORS_Aout_2026.pdf';
import { bilan2026, circuitsAnnonces2025, perspectives20262027 } from '../../data/newsletters';

const ReportPreview = () => (
  <section id="infolettres" className="bg-[#eee9df] py-20 dark:bg-stone-900 md:py-28">
    <div className="mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.045em] md:text-6xl">Nos Infolettres</h2>
          <p className="mt-5 text-lg text-stone-600 dark:text-stone-300">
            LIMAJS MOTORS SA — L&apos;accès et l&apos;assurance de voyager !
          </p>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
          Nos infolettres sont la seule source officielle d&apos;information sur l&apos;entreprise : cheminement,
          réalisations, bilan et perspectives. Deux numéros ont été publiés à ce jour.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {/* Infolettre Juin 2025 */}
        <article className="grid bg-white dark:bg-stone-950 sm:grid-cols-[0.8fr_1.2fr]">
          <img src={cover2025} alt="Couverture de l'infolettre LIMAJS MOTORS SA de juin 2025" className="h-full min-h-[460px] w-full object-cover object-top" loading="lazy" />
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Numéro 1</p>
              <h3 className="mt-3 text-3xl font-semibold">Infolettre — Juin 2025</h3>
              <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">
                Préambule, organisation, réalisations de 2023 à 2025 et perspectives pour 2025-2026.
              </p>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                Trois circuits annoncés (Sept.-Déc. 2025)
              </p>
              <ul className="mt-3 space-y-2 text-stone-600 dark:text-stone-300">
                {circuitsAnnonces2025.map((circuit) => (
                  <li key={circuit}>{circuit}</li>
                ))}
              </ul>
            </div>
            <a href={pdf2025} download className="mt-10 inline-flex bg-primary px-5 py-3 text-center font-semibold text-white hover:bg-primary-dark">
              Télécharger l&apos;infolettre de juin 2025 (PDF)
            </a>
          </div>
        </article>

        {/* Infolettre Août 2026 */}
        <article className="grid bg-secondary text-white sm:grid-cols-[0.8fr_1.2fr]">
          <img src={cover2026} alt="Couverture de l'infolettre LIMAJS MOTORS SA d'août 2026" className="h-full min-h-[460px] w-full object-cover object-top" loading="lazy" />
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff9a5e]">Numéro 2</p>
              <h3 className="mt-3 text-3xl font-semibold">Infolettre — Août 2026</h3>
              <p className="mt-4 leading-relaxed text-white/80">
                Deux ans de parcours, un bilan réussi. Vision, mission, valeurs, bilan financier et
                perspectives pour 2026-2027.
              </p>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.14em] text-white/60">
                Perspectives 2026-2027
              </p>
              <ul className="mt-3 space-y-2 text-white/80">
                {perspectives20262027.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-white/60">
                Chiffre d&apos;affaires 2026 : {bilan2026.chiffreAffaires2026}.
              </p>
            </div>
            <a href={pdf2026} download className="mt-10 inline-flex border border-white px-5 py-3 text-center font-semibold text-white hover:bg-white hover:text-secondary">
              Télécharger l&apos;infolettre d&apos;août 2026 (PDF)
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default ReportPreview;
