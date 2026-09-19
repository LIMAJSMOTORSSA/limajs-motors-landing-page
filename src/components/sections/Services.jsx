import Section from '../ui/Section';
import { audiences, circuitsAnnonces2025, origin } from '../../data/newsletters';

import schoolImage from '../../assets/images/service/cite-du-savoir.webp';
import groupImage from '../../assets/images/service/groupe-ecoliers.webp';
import boardingImage from '../../assets/images/service/embarquement.webp';
import tripImage from '../../assets/images/service/trajet-quotidien.webp';
import carteEcoliers from '../../assets/images/cards/carte-ecoliers.webp';

const PASSENGER_URL = 'https://passenger.limajs.com';

// Statut de chaque service, établi uniquement d'après les infolettres.
const serviceTypes = [
  {
    title: 'Transport',
    description:
      "Le transport quotidien des écoliers entre leur demeure et la Cité du Savoir, lancé le 01 octobre 2024.",
    image: groupImage,
    status: 'En service',
    available: true,
  },
  {
    title: 'Abonnements',
    description:
      "La souscription au service d'abonnement est ouverte au public cible depuis juillet 2024.",
    image: carteEcoliers,
    status: 'En service',
    available: true,
    contain: true,
  },
  {
    title: 'Location de motos',
    description:
      "Annoncé pour 2026-2027 : diversifier nos services en nous investissant dans la location de motos.",
    image: null,
    status: 'Bientôt disponible',
    available: false,
  },
  {
    title: 'Livraison de colis',
    description:
      "Annoncé pour 2026-2027 : diversifier nos services en nous investissant dans le transport de colis.",
    image: null,
    status: 'Bientôt disponible',
    available: false,
  },
];

const audienceImages = [schoolImage, boardingImage, tripImage];

const Services = () => (
  <Section
    id="services"
    title="Nos Services"
    subtitle="Favoriser la mobilité durable des écoliers, des universitaires et des professionnels."
    bgColor="bg-[#f6f4ef] dark:bg-stone-950"
  >
    <div className="grid border-y border-stone-300 dark:border-stone-700 lg:grid-cols-2">
      {serviceTypes.map((service, index) => (
        <article
          key={service.title}
          className={`grid min-h-[360px] grid-cols-1 bg-white dark:bg-stone-900 sm:grid-cols-2 ${index % 2 === 0 ? 'lg:border-r' : ''} border-t border-stone-300 dark:border-stone-700 lg:border-t-0`}
        >
          {service.image ? (
            <img
              src={service.image}
              alt=""
              className={`h-64 w-full sm:h-full ${service.contain ? 'bg-stone-100 object-contain p-6 dark:bg-stone-800' : 'object-cover'}`}
              loading="lazy"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-stone-100 px-6 text-center dark:bg-stone-800 sm:h-full">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
                Service à venir
              </span>
            </div>
          )}
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">0{index + 1}</p>
              <h3 className="text-3xl font-semibold">{service.title}</h3>
              <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">{service.description}</p>
            </div>
            <span
              className={`mt-8 inline-flex w-fit px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
                service.available
                  ? 'bg-primary/10 text-primary'
                  : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              {service.status}
            </span>
          </div>
        </article>
      ))}
    </div>

    {/* Les trois publics de la mission — Infolettre Août 2026 */}
    <div className="py-20 md:py-28">
      <div className="mb-12 grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-end">
        <h3 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Pour qui nous roulons</h3>
        <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
          L&apos;entreprise accorde une attention particulière à la mobilité durable de trois publics.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {audiences.map((audience, index) => (
          <div key={audience.title} className="relative min-h-[330px] overflow-hidden">
            <img src={audienceImages[index]} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-black/65 p-6 text-white">
              <h4 className="text-2xl font-semibold">{audience.title}</h4>
              <p className="mt-2 leading-relaxed text-white/85">{audience.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Service actuel */}
    <div className="grid gap-10 border-y border-stone-300 py-14 dark:border-stone-700 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h3 className="text-3xl font-semibold md:text-4xl">Le service aujourd&apos;hui</h3>
        <p className="mt-5 leading-relaxed text-stone-600 dark:text-stone-300">{origin.launch}</p>
        <ul className="mt-6 space-y-2 text-stone-700 dark:text-stone-200">
          {origin.schools.map((school) => (
            <li key={school}>— {school}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">Source : Infolettre Juin 2025.</p>
      </div>
      <div>
        <h3 className="text-3xl font-semibold md:text-4xl">Circuits annoncés</h3>
        <p className="mt-5 leading-relaxed text-stone-600 dark:text-stone-300">
          Trois circuits ont été annoncés pour la période de septembre à décembre 2025, et un circuit
          Cap-Haïtien — Morne-Rouge pour 2026-2027.
        </p>
        <ul className="mt-6 divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
          {circuitsAnnonces2025.map((circuit, index) => (
            <li key={circuit} className="grid gap-3 py-4 sm:grid-cols-[48px_1fr]">
              <span className="text-sm font-semibold text-primary">0{index + 1}</span>
              <span className="text-stone-700 dark:text-stone-200">{circuit}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-stone-500 dark:text-stone-400">
          Sources : Infolettre Juin 2025 et Infolettre Août 2026.
        </p>
      </div>
    </div>

    <div className="mt-14 flex flex-wrap gap-4">
      <a
        href={PASSENGER_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex bg-primary px-7 py-3.5 font-semibold text-white hover:bg-primary-dark"
      >
        Créer un compte passager
      </a>
    </div>
  </Section>
);

export default Services;
