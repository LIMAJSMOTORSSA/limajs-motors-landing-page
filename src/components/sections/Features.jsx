import Section from '../ui/Section';
import { troisiemeAnnee, values } from '../../data/newsletters';

import carteEtudiants from '../../assets/images/cards/carte-etudiants.webp';
import carteEcoliers from '../../assets/images/cards/carte-ecoliers.webp';
import carteEmployes from '../../assets/images/cards/carte-employes.webp';
import interiorImage from '../../assets/images/service/interieur-bus.webp';

// Cartes d'accès publiées dans l'infolettre de juin 2025 (p. 14).
const cards = [
  [carteEtudiants, "Carte d'accès étudiants(es)"],
  [carteEcoliers, "Carte d'accès écoliers"],
  [carteEmployes, "Carte d'accès employé(e)s"],
];

const Features = () => (
  <Section
    id="features"
    title="Cartes d'accès et perspectives"
    subtitle="Le service repose sur des cartes d'accès nominatives, préparées dès 2024 pour les usagers du transport."
    bgColor="bg-white dark:bg-stone-900"
  >
    {/* Cartes d'accès réelles */}
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div>
        <h3 className="text-4xl font-semibold tracking-[-0.035em]">Les cartes d&apos;accès aux bus</h3>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-300">
          La préparation des cartes NFC pour les usagers du service a été complétée entre juillet et août 2024,
          avant le lancement du service.
        </p>
        <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">
          Trois catégories de cartes existent : étudiants(es), écoliers et employé(e)s.
        </p>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Juin 2025.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map(([src, label]) => (
          <figure key={label}>
            <img src={src} alt={label} className="w-full rounded-lg" loading="lazy" />
            <figcaption className="mt-3 text-sm text-stone-600 dark:text-stone-300">{label}</figcaption>
          </figure>
        ))}
      </div>
    </div>

    {/* Vente de cartes — calendrier annoncé */}
    <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
      <img src={interiorImage} alt="Intérieur du véhicule de LIMAJS MOTORS SA avec des écoliers et l'agente de sûreté" className="order-1 aspect-[4/3] w-full object-cover" loading="lazy" />
      <div className="order-2">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Calendrier annoncé</p>
        <div className="mt-6 divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
          {[
            ['Août 2026', "Discussion avec un fournisseur de carte NFC et d'un système informatique pour la vente de carte"],
            ['Août 2026', "Mise en place d'un système de vente de carte NFC pour l'accès au service de transport"],
            ['Septembre 2026', 'Installation de bureau de vente de carte de transport'],
            ['Décembre 2026', 'Lancement de LIMAJS MOTORS SA au grand public et ouverture du service au grand public'],
          ].map(([date, label]) => (
            <div key={label} className="grid gap-2 py-5 sm:grid-cols-[140px_1fr]">
              <p className="text-sm font-semibold text-primary">{date}</p>
              <p className="leading-relaxed text-stone-700 dark:text-stone-200">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
          Source : Infolettre Juin 2025, perspectives 2025-2026.
        </p>
      </div>
    </div>

    {/* Une troisième année vers le progrès — Infolettre Août 2026 */}
    <div className="mt-24">
      <h3 className="text-4xl font-semibold tracking-[-0.035em]">Une troisième année vers le progrès</h3>
      <p className="mt-5 max-w-2xl text-lg text-stone-600 dark:text-stone-300">
        Durant cette troisième année, nous nous ouvrons à de nouvelles perspectives et opportunités.
      </p>
      <div className="mt-10 grid border-y border-stone-300 dark:border-stone-700 sm:grid-cols-2 lg:grid-cols-4">
        {troisiemeAnnee.map(([label, description], index) => (
          <div key={label} className={`border-t border-stone-300 p-7 dark:border-stone-700 lg:border-t-0 lg:p-9 ${index < troisiemeAnnee.length - 1 ? 'lg:border-r' : ''}`}>
            <h4 className="text-xl font-semibold text-primary">{label}</h4>
            <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">{description}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Août 2026.</p>
    </div>

    {/* Valeurs, rappel court */}
    <div className="mt-24 grid gap-8 border-t border-stone-300 pt-10 dark:border-stone-700 md:grid-cols-3">
      {values.map((value) => (
        <div key={value.name}>
          <h4 className="text-xl font-semibold">{value.name}</h4>
          <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">{value.tagline}</p>
        </div>
      ))}
    </div>
  </Section>
);

export default Features;
