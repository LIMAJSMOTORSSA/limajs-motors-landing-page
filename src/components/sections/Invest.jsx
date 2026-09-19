import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import { bilan2026, offreActions, perspectives20262027 } from '../../data/newsletters';
import busImage from '../../assets/images/service/descente.webp';

// Tous les chiffres proviennent de l'Infolettre Août 2026, section « Bilan et perspectives ».
const bilanRows = [
  ['Actionnaires réunis depuis le lancement', String(bilan2026.actionnaires)],
  ["Manifestation d'intérêt", bilan2026.manifestationInteret],
  ['Objectif de financement', bilan2026.objectifFinancement],
  ['Actions ordinaires vendues', String(bilan2026.actionsOrdinairesVendues)],
  ['Actions privilégiées vendues', String(bilan2026.actionsPrivilegieesVendues)],
  ['Total collecté en dollars', bilan2026.collecteUSD],
  ['Total collecté en gourdes', bilan2026.collecteHTG],
  ["Chiffre d'affaires de l'année 2026", bilan2026.chiffreAffaires2026],
];

const shareTypes = [
  {
    title: 'Actions privilégiées',
    price: offreActions.privilegiees.prix,
    count: offreActions.privilegiees.nombre,
  },
  {
    title: 'Actions ordinaires',
    price: offreActions.ordinaires.prix,
    count: offreActions.ordinaires.nombre,
  },
];

const Invest = () => (
  <Section
    id="invest"
    title="Investir dans LIMAJS MOTORS"
    subtitle="Le bilan et l'offre d'actions tels que publiés dans l'infolettre d'août 2026."
    bgColor="bg-[#f6f4ef] dark:bg-stone-950"
  >
    {/* Bilan chiffré */}
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <h3 className="text-3xl font-semibold md:text-4xl">Bilan depuis le lancement</h3>
        <p className="mt-5 leading-relaxed text-stone-600 dark:text-stone-300">{bilan2026.usageCollecte}</p>
        <dl className="mt-9 divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
          {bilanRows.map(([label, value]) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <dt className="text-stone-600 dark:text-stone-300">{label}</dt>
              <dd className="text-xl font-semibold text-primary">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Août 2026.</p>
      </div>
      <img src={busImage} alt="Écoliers autour du véhicule de LIMAJS MOTORS SA" className="h-full min-h-[420px] w-full object-cover" loading="lazy" />
    </div>

    {/* Offre d'actions en cours */}
    <div className="mt-24">
      <h3 className="text-3xl font-semibold md:text-4xl">L&apos;offre d&apos;actions en cours</h3>
      <p className="mt-5 max-w-3xl leading-relaxed text-stone-600 dark:text-stone-300">
        Pour cette année, l&apos;entreprise met en vente {offreActions.ordinaires.nombre} actions ordinaires
        ({offreActions.ordinaires.prix}) et {offreActions.privilegiees.nombre} actions privilégiées
        ({offreActions.privilegiees.prix}), soit un taux de {offreActions.tauxObjectif} de son objectif de
        financement de {offreActions.objectif}.
      </p>
      <div className="mt-10 grid border-y border-stone-300 dark:border-stone-700 md:grid-cols-2">
        {shareTypes.map((shareType, index) => (
          <div key={shareType.title} className={`p-7 md:p-10 ${index === 0 ? 'md:border-r' : 'border-t md:border-t-0'} border-stone-300 dark:border-stone-700`}>
            <h4 className="text-2xl font-semibold">{shareType.title}</h4>
            <p className="mt-4 text-4xl font-semibold text-primary">{shareType.price}</p>
            <p className="mt-3 text-stone-600 dark:text-stone-300">
              {shareType.count} actions mises en vente cette année
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Août 2026.</p>
    </div>

    {/* Perspectives 2026-2027 */}
    <div className="mt-24 grid bg-secondary p-8 text-white md:p-14">
      <h3 className="text-3xl font-semibold md:text-4xl">Ce que prépare l&apos;entreprise pour 2026-2027</h3>
      <ul className="mt-9 divide-y divide-white/20 border-y border-white/20">
        {perspectives20262027.map((item, index) => (
          <li key={item} className="grid gap-3 py-5 sm:grid-cols-[56px_1fr]">
            <span className="text-sm font-semibold text-[#ff9a5e]">0{index + 1}</span>
            <span className="text-lg text-white/85">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-9 max-w-3xl leading-relaxed text-white/75">
        Nous continuerons à chercher des partenaires et investisseurs qui pourront nous aider à atteindre les
        objectifs que nous nous sommes fixés pour cette période.
      </p>
      <div>
        <Link to="/contact" className="mt-9 inline-flex border border-white px-7 py-3.5 font-semibold text-white hover:bg-white hover:text-secondary">
          Nous contacter
        </Link>
      </div>
    </div>
  </Section>
);

export default Invest;
