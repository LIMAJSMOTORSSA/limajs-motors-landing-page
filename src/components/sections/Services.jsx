import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import schoolImage from '../../assets/images/editorial/school-boarding.webp';
import universityImage from '../../assets/images/editorial/university-commute.webp';
import professionalImage from '../../assets/images/editorial/professional-commute.webp';
import publicImage from '../../assets/images/editorial/cap-haitien-street.webp';
import urbanImage from '../../assets/images/editorial/interurban-road.webp';
import subscriptionImage from '../../assets/images/editorial/nfc-payment.webp';
import rentalImage from '../../assets/images/editorial/vehicle-interior.webp';
import deliveryImage from '../../assets/images/editorial/parcel-service.webp';

const serviceTypes = [
  { title: 'Transport Urbain', description: 'Un service régulier et ponctuel à travers Cap-Haïtien et ses environs.', link: '/services/transport-urbain', image: urbanImage },
  { title: 'Abonnements', description: "Économisez avec nos formules d'abonnement adaptées à vos besoins.", link: '/services/abonnements', image: subscriptionImage },
  { title: 'Location', description: "Besoin d'un véhicule pour vos déplacements personnels? Découvrez notre flotte.", link: '/services/location', image: rentalImage },
  { title: 'Livraison', description: 'Nous transportons vos colis avec une fiabilité exemplaire.', link: '/services/livraison', image: deliveryImage },
];

const clients = [
  { title: 'Écoliers', description: 'Des trajets sécurisés et confortables pour vos petits, chaque jour.', link: '/services/transport-urbain?client=ecoliers', image: schoolImage },
  { title: 'Étudiants', description: "Arrivez à l'heure à vos cours avec notre service de transport rapide et abordable.", link: '/services/transport-urbain?client=etudiants', image: universityImage },
  { title: 'Employés', description: 'Commencez votre journée de travail sans tracas grâce à notre service de transport efficace.', link: '/services/transport-urbain?client=employes', image: professionalImage },
  { title: 'Grand public', description: 'Déplacez-vous facilement à travers la ville à un prix abordable.', link: '/services/transport-urbain?client=public', image: publicImage },
];

const features = [
  ['Fiabilité', 'Horaires précis et trajets optimisés'],
  ['Sécurité', 'Véhicules entretenus et chauffeurs formés'],
  ['Accessibilité', 'Tarifs abordables et paiement flexible'],
  ['Innovation', 'Paiement sans contact par carte NFC'],
];

const Services = () => (
  <Section id="services" title="Nos Services" subtitle="Découvrez nos solutions de transport adaptées à vos besoins quotidiens." bgColor="bg-[#f6f4ef] dark:bg-stone-950">
    <div className="grid border-y border-stone-300 dark:border-stone-700 lg:grid-cols-2">
      {serviceTypes.map((service, index) => (
        <Link key={service.title} to={service.link} className={`group grid min-h-[360px] grid-cols-1 bg-white dark:bg-stone-900 sm:grid-cols-2 ${index % 2 === 0 ? 'lg:border-r' : ''} border-stone-300 dark:border-stone-700`}>
          <img src={service.image} alt="" className="h-64 w-full object-cover sm:h-full" loading="lazy" />
          <div className="flex flex-col justify-between p-7 md:p-10">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">0{index + 1}</p><h3 className="text-3xl font-semibold">{service.title}</h3><p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">{service.description}</p></div>
            <span className="mt-8 border-b border-stone-900 pb-1 text-sm font-semibold dark:border-white">En savoir plus</span>
          </div>
        </Link>
      ))}
    </div>

    <div className="py-20 md:py-28">
      <div className="mb-12 grid gap-5 md:grid-cols-[1fr_1.2fr] md:items-end">
        <h3 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Transport Urbain et Interurbain</h3>
        <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">Un service régulier et ponctuel à travers Cap-Haïtien et ses environs pour tous types de clientèle.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-12 md:grid-rows-2">
        {clients.map((client, index) => (
          <Link key={client.title} to={client.link} className={`group relative min-h-[330px] overflow-hidden ${index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5'}`}>
            <img src={client.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-black/65 p-6 text-white">
              <h4 className="text-2xl font-semibold">{client.title}</h4><p className="mt-2 max-w-lg leading-relaxed text-white/85">{client.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>

    <div className="grid border-y border-stone-300 dark:border-stone-700 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(([label, description], index) => <div key={label} className={`p-7 lg:p-9 ${index < features.length - 1 ? 'lg:border-r' : ''} border-stone-300 dark:border-stone-700`}><h4 className="text-xl font-semibold text-primary">{label}</h4><p className="mt-3 text-stone-600 dark:text-stone-300">{description}</p></div>)}
    </div>
    <div className="mt-14"><Link to="/contact" className="inline-flex bg-primary px-7 py-3.5 font-semibold text-white hover:bg-primary-dark">Réserver un service</Link></div>
  </Section>
);

export default Services;
