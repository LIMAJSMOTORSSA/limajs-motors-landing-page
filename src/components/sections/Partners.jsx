import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import routeImage from '../../assets/images/editorial/morne-rouge-route.webp';

const partners = [
  ['BUSKO', 'Partenaire technologique', 'Solutions technologiques pour le transport public'],
  ['ISTEAH', 'Partenaire académique', "Institut des Sciences, des Technologies et des Études Avancées d'Haïti"],
  ['GRAHN', 'Partenaire stratégique', "Groupe de Réflexion et d'Action pour une Haïti Nouvelle"],
  ['PIGraN', "Partenaire d'innovation", "Pôle d'Innovation du Grand Nord"],
];

const Partners = () => (
  <Section id="partners" title="Nos Partenaires" subtitle="Nous collaborons avec des institutions de confiance pour vous offrir le meilleur service possible." bgColor="bg-white dark:bg-stone-900">
    <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
      <img src={routeImage} alt="" className="h-full min-h-[560px] w-full object-cover" loading="lazy" />
      <div className="bg-[#121820] p-8 text-white md:p-12">
        <blockquote><p className="text-3xl font-semibold leading-tight">&quot;Ensemble, nous construisons l&apos;avenir du transport en Haïti&quot;</p><footer className="mt-5 text-sm text-white/60">— La vision partagée de nos partenariats</footer></blockquote>
        <div className="mt-12 border-t border-white/20">
          {partners.map(([name, type, description]) => <div key={name} className="grid gap-2 border-b border-white/20 py-6 sm:grid-cols-[90px_1fr]"><h3 className="font-semibold text-[#ff9a5e]">{name}</h3><div><p className="font-semibold">{type}</p><p className="mt-1 text-sm leading-relaxed text-white/65">{description}</p></div></div>)}
        </div>
      </div>
    </div>
    <div className="mt-14 grid gap-5 border-t border-stone-300 pt-10 dark:border-stone-700 md:grid-cols-[1fr_auto] md:items-end"><div><h3 className="text-3xl font-semibold">Intéressé à devenir partenaire?</h3><p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-300">Nous sommes toujours à la recherche de nouveaux partenariats pour améliorer nos services et contribuer au développement du transport en Haïti.</p></div><Link to="/contact" className="inline-flex bg-primary px-7 py-3.5 font-semibold text-white hover:bg-primary-dark">Contactez-nous</Link></div>
  </Section>
);

export default Partners;
