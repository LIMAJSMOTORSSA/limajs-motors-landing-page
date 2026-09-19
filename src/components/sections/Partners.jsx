import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import { partners } from '../../data/newsletters';
import PartnersLogos from '../../assets/images/partners/professional-img.png';
import routeImage from '../../assets/images/service/prise-en-charge.webp';

const Partners = () => (
  <Section
    id="partners"
    title="Nos Partenaires"
    subtitle="Nous collaborons avec des institutions de confiance pour vous offrir le meilleur service possible."
    bgColor="bg-white dark:bg-stone-900"
  >
    {/* Logos officiels des partenaires */}
    <div className="border-y border-stone-300 bg-white py-10 dark:border-stone-700 dark:bg-white">
      <img
        src={PartnersLogos}
        alt="Logos des partenaires de LIMAJS MOTORS SA : GRAHN, PIGraN, ISTEAH et BUSKO"
        className="mx-auto w-full max-w-3xl"
        loading="lazy"
      />
    </div>

    <div className="mt-14 grid lg:grid-cols-[1.2fr_0.8fr]">
      <img src={routeImage} alt="Un écolier accompagné jusqu'au véhicule du service" className="h-full min-h-[560px] w-full object-cover" loading="lazy" />
      <div className="bg-[#121820] p-8 text-white md:p-12">
        <blockquote>
          <p className="text-3xl font-semibold leading-tight">
            &quot;Le transport est un système qui repose sur la collaboration.&quot;
          </p>
          <footer className="mt-5 text-sm text-white/60">— Infolettre Août 2026, Le Réseautage</footer>
        </blockquote>
        <div className="mt-12 border-t border-white/20">
          {partners.map((partner) => (
            <div key={partner.name} className="grid gap-2 border-b border-white/20 py-6 sm:grid-cols-[100px_1fr]">
              <h3 className="font-semibold text-[#ff9a5e]">{partner.name}</h3>
              <div>
                <p className="leading-relaxed text-white/80">{partner.description}</p>
                <p className="mt-2 text-xs text-white/45">{partner.sources.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-14 grid gap-5 border-t border-stone-300 pt-10 dark:border-stone-700 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <h3 className="text-3xl font-semibold">Intéressé à devenir partenaire?</h3>
        <p className="mt-4 max-w-2xl leading-relaxed text-stone-600 dark:text-stone-300">
          Nous continuerons à chercher des partenaires et investisseurs qui pourront nous aider à atteindre
          les objectifs que nous nous sommes fixés pour cette période.
        </p>
      </div>
      <Link to="/contact" className="inline-flex bg-primary px-7 py-3.5 font-semibold text-white hover:bg-primary-dark">
        Contactez-nous
      </Link>
    </div>
  </Section>
);

export default Partners;
