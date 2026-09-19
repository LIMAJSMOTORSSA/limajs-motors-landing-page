import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import {
  origin,
  vision,
  mission,
  audiences,
  values,
  realisations,
  bilan2026,
  bilanDeuxAns,
} from '../../data/newsletters';

import communityImage from '../../assets/images/service/groupe-ecoliers.webp';
import routeImage from '../../assets/images/service/route-milot.webp';
import schoolImage from '../../assets/images/service/cite-du-savoir.webp';
import boardingImage from '../../assets/images/service/embarquement.webp';

// Chiffres repris littéralement de l'Infolettre Août 2026 (bilan et perspectives).
const figures = [
  [String(bilan2026.actionnaires), 'Actionnaires réunis depuis le lancement'],
  [bilan2026.manifestationInteret, `Manifestation d'intérêt, sur un objectif de ${bilan2026.objectifFinancement}`],
  [bilan2026.chiffreAffaires2026, "Chiffre d'affaires de l'année 2026"],
  ['01 oct. 2024', 'Lancement du service à la Cité du Savoir'],
];

const About = () => (
  <Section
    id="about"
    title="À Propos de LIMAJS MOTORS"
    subtitle="Connecter les gens et les communautés par le transport."
    bgColor="bg-[#f6f4ef] dark:bg-stone-950"
  >
    <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <img src={communityImage} alt="Écoliers transportés par LIMAJS MOTORS SA devant le véhicule du service" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <div className="grid grid-cols-2 border-x border-b border-stone-300 dark:border-stone-700">
          {figures.map(([value, label]) => (
            <div key={label} className="border-r border-t border-stone-300 p-5 last:border-r-0 dark:border-stone-700">
              <p className="text-2xl font-semibold leading-tight text-primary">{value}</p>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">Source : Infolettre Août 2026.</p>
      </div>

      <div className="lg:pt-16">
        <h3 className="text-3xl font-semibold text-primary">Notre Vision</h3>
        <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{vision.body}</p>

        <h3 className="mt-12 text-3xl font-semibold text-primary">Notre Mission</h3>
        <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{mission.body}</p>

        <div className="mt-8 divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
          {audiences.map((audience) => (
            <div key={audience.title} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr]">
              <p className="font-semibold text-primary">{audience.title}</p>
              <p className="leading-relaxed text-stone-600 dark:text-stone-300">{audience.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Origine — Infolettre Juin 2025, préambule */}
    <div className="mt-28 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <h3 className="text-4xl font-semibold tracking-[-0.04em]">Une initiative née à l&apos;ISTEAH</h3>
        <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{origin.founded}</p>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{origin.motivation}</p>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{origin.launch}</p>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Juin 2025.</p>
      </div>
      <img src={schoolImage} alt="Prise en charge des écoliers à la Cité du Savoir" className="h-full min-h-[420px] w-full object-cover" loading="lazy" />
    </div>

    {/* Valeurs — Infolettre Août 2026 */}
    <div className="mt-28">
      <h3 className="text-4xl font-semibold tracking-[-0.04em]">Nos trois valeurs fondamentales</h3>
      <p className="mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-300">
        Pour accomplir sa mission, l&apos;entreprise construit son action autour de l&apos;Excellence, du Réseautage et de la Multiplication.
      </p>
      <div className="mt-10 grid border-y border-stone-300 dark:border-stone-700 lg:grid-cols-3">
        {values.map((value, index) => (
          <div key={value.name} className={`p-7 lg:p-9 ${index < values.length - 1 ? 'lg:border-r' : ''} border-t border-stone-300 dark:border-stone-700 lg:border-t-0`}>
            <h4 className="text-2xl font-semibold text-primary">{value.name}</h4>
            <p className="mt-3 font-medium text-stone-800 dark:text-stone-100">{value.tagline}</p>
            <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">{value.body}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Réalisations — tableau de l'Infolettre Juin 2025 */}
    <div className="mt-28 grid gap-10 lg:grid-cols-[1fr_0.75fr]">
      <div>
        <h3 className="text-4xl font-semibold tracking-[-0.04em]">Nos réalisations</h3>
        <p className="mt-4 text-lg text-stone-600 dark:text-stone-300">
          Les étapes effectivement franchies, telles que publiées dans l&apos;infolettre de juin 2025.
        </p>
        <div className="mt-10 border-t border-stone-300 dark:border-stone-700">
          {realisations.map(([description, date, status]) => (
            <div key={description} className="grid gap-3 border-b border-stone-300 py-5 dark:border-stone-700 sm:grid-cols-[150px_1fr_110px]">
              <p className="text-sm font-semibold text-primary">{date}</p>
              <p className="leading-relaxed text-stone-700 dark:text-stone-200">{description}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 sm:text-right">{status}</p>
            </div>
          ))}
        </div>
      </div>
      <img src={boardingImage} alt="Écoliers embarquant dans le véhicule de LIMAJS MOTORS SA" className="h-full min-h-[600px] w-full object-cover" loading="lazy" />
    </div>

    {/* Deux années de service — Infolettre Août 2026 */}
    <div className="mt-28 grid bg-secondary text-white lg:grid-cols-2">
      <img src={routeImage} alt="Écoliers accompagnés jusqu'au véhicule sur la route de Milot" className="h-full min-h-[520px] w-full object-cover" loading="lazy" />
      <div className="p-8 md:p-14">
        <h3 className="text-4xl font-semibold">Deux ans de parcours</h3>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{bilanDeuxAns.intro}</p>
        <p className="mt-5 max-w-xl leading-relaxed text-white/70">{bilanDeuxAns.challenges}</p>
        <p className="mt-5 max-w-xl leading-relaxed text-white/70">{bilan2026.usageCollecte}</p>
        <p className="mt-8 text-sm text-white/50">Source : Infolettre Août 2026.</p>
        <Link to="/infolettres" className="mt-8 inline-flex border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-secondary">
          Lire les infolettres
        </Link>
      </div>
    </div>
  </Section>
);

export default About;
