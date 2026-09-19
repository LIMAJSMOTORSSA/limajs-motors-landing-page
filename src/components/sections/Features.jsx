import PropTypes from 'prop-types';
import Section from '../ui/Section';
import nfcImage from '../../assets/images/editorial/nfc-payment.webp';
import interiorImage from '../../assets/images/editorial/vehicle-interior.webp';
import maintenanceImage from '../../assets/images/editorial/fleet-maintenance.webp';

const cardFeatures = [
  ['Inscription facile', 'Inscrivez-vous rapidement grâce à une interface utilisateur intuitive.'],
  ['Rechargement des cartes', "Rechargez vos cartes de transport facilement via l'application."],
  ['Validation des trajets', 'Validez vos trajets en un geste avec la technologie NFC.'],
  ['Gestion des transactions', 'Suivez et gérez toutes vos transactions en temps réel.'],
];

const advantages = [
  ['Sécurité maximale', 'Tous nos véhicules sont régulièrement inspectés et nos chauffeurs formés aux normes de sécurité.'],
  ['Flotte moderne', 'Des véhicules récents et bien entretenus pour un confort optimal lors de vos déplacements.'],
  ['Service inclusif', 'Nous nous engageons à rendre nos services accessibles à tous les membres de la communauté.'],
  ['Support client 24/7', 'Notre équipe est disponible à tout moment pour répondre à vos questions et résoudre vos problèmes.'],
];

const TextList = ({ items }) => (
  <div className="divide-y divide-stone-300 border-y border-stone-300 dark:divide-stone-700 dark:border-stone-700">
    {items.map(([title, description], index) => (
      <div key={title} className="grid gap-3 py-6 sm:grid-cols-[56px_1fr]">
        <span className="text-sm font-semibold text-primary">0{index + 1}</span>
        <div><h4 className="text-xl font-semibold">{title}</h4><p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">{description}</p></div>
      </div>
    ))}
  </div>
);

const Features = () => (
  <Section id="features" title="Fonctionnalités" subtitle="Découvrez les fonctionnalités innovantes qui rendent vos déplacements plus simples et plus efficaces." bgColor="bg-white dark:bg-stone-900">
    <div className="grid items-stretch gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <img src={nfcImage} alt="" className="min-h-[520px] h-full w-full object-cover" loading="lazy" />
      <div className="flex flex-col justify-center">
        <h3 className="text-4xl font-semibold tracking-[-0.035em]">Carte de Transport Intelligente</h3>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-300">Notre système de carte NFC révolutionne vos déplacements au quotidien.</p>
        <div className="mt-9"><TextList items={cardFeatures} /></div>
      </div>
    </div>

    <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
      <div className="order-2 lg:order-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Carte de Transport NFC</p>
        <p className="mt-5 max-w-xl text-3xl font-semibold leading-tight">Accédez à tous nos services avec une seule carte. Rechargez-la, suivez votre historique et gérez vos abonnements.</p>
      </div>
      <img src={interiorImage} alt="" className="order-1 aspect-[4/3] w-full object-cover lg:order-2" loading="lazy" />
    </div>

    <div className="mt-24 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <div><h3 className="text-4xl font-semibold tracking-[-0.035em]">Nos Avantages</h3><p className="mt-5 text-lg text-stone-600 dark:text-stone-300">Ce qui nous différencie des autres services de transport.</p><div className="mt-9"><TextList items={advantages} /></div></div>
      <img src={maintenanceImage} alt="" className="h-full min-h-[560px] w-full object-cover" loading="lazy" />
    </div>
  </Section>
);

TextList.propTypes = { items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired };

export default Features;
