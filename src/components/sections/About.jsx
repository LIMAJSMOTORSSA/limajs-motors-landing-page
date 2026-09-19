import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import passengerImage from '../../assets/images/editorial/passenger-community.webp';
import driverImage from '../../assets/images/editorial/driver-operations.webp';
import schoolImage from '../../assets/images/editorial/school-arrival.webp';
import waitingImage from '../../assets/images/editorial/waiting-point.webp';

const historyItems = [
  ['Septembre 2021', 'Création de LIMAJS MOTORS SA', 'LIMAJS MOTORS SA voit le jour. Le nom est un acronyme qui réunit les noms/prénoms des initiateurs du projet: Lina Joseph Charles, Michel Jacky, Antenor Wilner, Janvier Noldey Jean Sonold et Sandro Serges Louis.'],
  ['Octobre 2021', 'Acquisition des premiers véhicules', 'Début des opérations avec une flotte initiale de bus modernes et confortables.'],
  ['Janvier 2022', "Lancement des services d'abonnement", "Introduction des formules d'abonnement pour les trajets réguliers."],
  ['Avril 2022', 'Intégration de la technologie NFC', 'Déploiement du système de paiement sans contact par carte NFC.'],
];

const stats = [['10+', 'Itinéraires'], ['1000+', 'Passagers'], ['99%', 'Ponctualité'], ['100%', 'Sécurité']];
const impact = [['11+', 'Emplois créés dès la première année'], ['Mobilité', 'Amélioration de la mobilité urbaine'], ['Solutions', 'Aux problèmes de transport quotidien'], ['Écologie', 'Technologie écoénergétique et durable']];

const About = () => (
  <Section id="about" title="À Propos de LIMAJS MOTORS" subtitle="Notre mission est de révolutionner le transport en commun dans le Nord d'Haïti." bgColor="bg-[#f6f4ef] dark:bg-stone-950">
    <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <img src={passengerImage} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <div className="grid grid-cols-2 border-x border-b border-stone-300 dark:border-stone-700">
          {stats.map(([value, label]) => <div key={label} className="border-r border-t border-stone-300 p-5 last:border-r-0 dark:border-stone-700"><p className="text-3xl font-semibold text-primary">{value}</p><p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{label}</p></div>)}
        </div>
      </div>
      <div className="lg:pt-16">
        <h3 className="text-3xl font-semibold text-primary">Notre Vision</h3>
        <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">Nous sommes dédiés à révolutionner le transport en commun dans le Nord d&apos;Haïti. Notre vision est de créer un réseau de transport moderne, fiable et accessible à tous.</p>
        <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-stone-300">En mettant l&apos;accent sur l&apos;innovation, le confort et la ponctualité, nous nous engageons à améliorer la mobilité urbaine et à faciliter les déplacements quotidiens de nos passagers.</p>
        <h3 className="mt-12 text-3xl font-semibold text-primary">Notre Mission</h3>
        <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">LIMAJS MOTORS SA vise à connecter les gens et les communautés par le transport. Elle se donne pour mission de favoriser la mobilité durable des écoliers, des universitaires et des professionnels par des systèmes de transport sécuritaires et accessibles. Ses actions se fondent d&apos;une part, sur l&apos;excellence, une façon d&apos;offrir continuellement un service de qualité optimale, rigoureux et respectueux qui valorise les parties prenantes et qui s&apos;inspire des meilleurs pratiques des systèmes de transports internationaux. D&apos;autres part, sur le réseautage, une façon d&apos;assurer la bonne liaison entre les acteurs du service tant local que régional, tant national qu&apos;international. Et enfin, la multiplication, une façon d&apos;assurer la durabilité du service dans le temps et dans l&apos;espace et garantir un effort de partenariat à l&apos;échelle mondiale. D&apos;où notre slogan : L&apos;accès et l&apos;assurance de voyager !</p>
        <Link to="/a-propos/histoire" className="mt-8 inline-flex border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white">Découvrir notre histoire</Link>
      </div>
    </div>

    <div className="mt-28 grid gap-10 lg:grid-cols-[1fr_0.9fr]">
      <div><h3 className="text-4xl font-semibold tracking-[-0.04em]">Notre Histoire</h3><p className="mt-4 text-lg text-stone-600 dark:text-stone-300">Découvrez les moments clés qui ont façonné LIMAJS MOTORS depuis sa création.</p><div className="mt-10 border-t border-stone-300 dark:border-stone-700">{historyItems.map(([date, title, description]) => <div key={date} className="grid gap-4 border-b border-stone-300 py-7 dark:border-stone-700 sm:grid-cols-[140px_1fr]"><p className="text-sm font-semibold text-primary">{date}</p><div><h4 className="text-xl font-semibold">{title}</h4><p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">{description}</p></div></div>)}</div></div>
      <img src={driverImage} alt="" className="h-full min-h-[600px] w-full object-cover" loading="lazy" />
    </div>

    <div className="mt-28 grid bg-secondary text-white lg:grid-cols-2">
      <img src={schoolImage} alt="" className="h-full min-h-[520px] w-full object-cover" loading="lazy" />
      <div className="p-8 md:p-14"><h3 className="text-4xl font-semibold">Notre Impact Social</h3><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">LIMAJS MOTORS SA contribue au développement économique et social du Nord d&apos;Haïti.</p><div className="mt-10 grid grid-cols-2 border-l border-t border-white/30">{impact.map(([title, description]) => <div key={title} className="border-b border-r border-white/30 p-5"><h4 className="text-2xl font-semibold text-[#ff9a5e]">{title}</h4><p className="mt-2 text-sm leading-relaxed text-white/75">{description}</p></div>)}</div><Link to="/a-propos/impact-social" className="mt-8 inline-flex border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-secondary">Découvrir notre impact</Link></div>
    </div>

    <div className="mt-28 grid gap-10 lg:grid-cols-2 lg:items-center">
      <div><h3 className="text-4xl font-semibold">Notre Équipe</h3><p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">L&apos;entreprise est dirigée par un conseil d&apos;administration (CA) qui est responsable de son contrôle et de sa gestion. Les membres ont des compétences diverses en gestion de projet, NTIC, recherche opérationnelle, et plus.</p><Link to="/a-propos/equipe" className="mt-8 inline-flex border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white">Rencontrer notre équipe</Link></div>
      <img src={waitingImage} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
    </div>
  </Section>
);

export default About;
