import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import LogoImage from '../../assets/images/logo/logo.png';
import { identity } from '../../data/newsletters';

const PASSENGER_URL = 'https://passenger.limajs.com';

const quickLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Investir', to: '/investir' },
  { label: 'Infolettres', to: '/infolettres' },
  { label: 'Partenaires', to: '/partenaires' },
  { label: 'Contact', to: '/contact' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121820] text-stone-300">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img src={LogoImage} alt="LIMAJS MOTORS" className="h-12 w-auto" />
              <span className="font-semibold tracking-[0.1em] text-white">LIMAJS MOTORS</span>
            </div>
            <p className="max-w-sm leading-relaxed text-stone-400">{identity.slogan}</p>
            <a
              href={PASSENGER_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex border border-white px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#121820]"
            >
              Espace passager
            </a>
            <div className="mt-7 flex gap-5">
              <a href="https://facebook.com/limajsmotors" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white"><Facebook size={19} /></a>
              <a href="https://instagram.com/limajsmotors" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white"><Instagram size={19} /></a>
              <a href="https://linkedin.com/company/limajsmotors" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white"><Linkedin size={19} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-white">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-white">Contact</h3>
            <ul className="space-y-4 text-stone-400">
              <li className="flex gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-primary" />
                <span>{identity.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={19} className="shrink-0 text-primary" />
                <a href="tel:+50941704234" className="hover:text-white">+509 41 70 4234</a>
              </li>
              <li className="flex gap-3">
                <Mail size={19} className="shrink-0 text-primary" />
                <a href={`mailto:${identity.email}`} className="hover:text-white">{identity.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-7 text-sm text-stone-500">
          <p>&copy; {currentYear} LIMAJS MOTORS S.A. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
