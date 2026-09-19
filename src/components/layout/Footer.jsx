import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import LogoImage from '../../assets/images/logo/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { label: 'Accueil', to: '/' }, { label: 'Services', to: '/services' },
    { label: 'À propos', to: '/a-propos' }, { label: 'Investir', to: '/investir' },
    { label: 'Partenaires', to: '/partenaires' }, { label: 'Contact', to: '/contact' },
  ];
  const serviceLinks = [
    { label: 'Transport Urbain', to: '/services/transport-urbain' },
    { label: 'Abonnements', to: '/services/abonnements' },
    { label: 'Location de Véhicules', to: '/services/location' },
    { label: 'Livraison et Coursier', to: '/services/livraison' },
  ];
  return (
    <footer className="bg-[#121820] text-stone-300">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="mb-6 flex items-center gap-3"><img src={LogoImage} alt="LIMAJS MOTORS" className="h-12 w-auto" /><span className="font-semibold tracking-[0.1em] text-white">LIMAJS MOTORS</span></div>
            <p className="max-w-sm leading-relaxed text-stone-400">Votre service de transport en commun moderne et fiable en Haïti.</p>
            <div className="mt-7 flex gap-5"><a href="https://facebook.com/limajsmotors" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={19} /></a><a href="https://instagram.com/limajsmotors" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19} /></a><a href="https://linkedin.com/company/limajsmotors" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a></div>
          </div>
          <div><h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-white">Liens Rapides</h3><ul className="space-y-3">{quickLinks.map((link) => <li key={link.to}><Link to={link.to} className="hover:text-white">{link.label}</Link></li>)}</ul></div>
          <div><h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-white">Nos Services</h3><ul className="space-y-3">{serviceLinks.map((link) => <li key={link.to}><Link to={link.to} className="hover:text-white">{link.label}</Link></li>)}</ul></div>
          <div><h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-white">Contact</h3><ul className="space-y-4 text-stone-400"><li className="flex gap-3"><MapPin size={19} className="mt-0.5 text-primary" /><span>Génipailler, 3e Section Milot</span></li><li className="flex gap-3"><Phone size={19} className="text-primary" /><a href="tel:+50941704234">+509 41 70 4234</a></li><li className="flex gap-3"><Mail size={19} className="text-primary" /><a href="mailto:mainoffice@limajs.com">mainoffice@limajs.com</a></li></ul></div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-7 text-sm text-stone-500 sm:flex-row"><p>&copy; {currentYear} LIMAJS MOTORS S.A. Tous droits réservés.</p><div><Link to="/confidentialite" className="mr-5 hover:text-white">Confidentialité</Link><Link to="/conditions" className="hover:text-white">Conditions d&apos;utilisation</Link></div></div>
      </div>
    </footer>
  );
};

export default Footer;
