import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import LogoImage from '../../assets/images/logo/logo.png';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/investir', label: 'Investir' },
  { to: '/partenaires', label: 'Partenaires' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, isDarkMode, toggleDarkMode } = useAppContext();
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:px-16">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3" aria-label="LIMAJS MOTORS">
          <img src={LogoImage} alt="LIMAJS MOTORS" className="h-11 w-auto" />
          <span className="hidden text-sm font-semibold tracking-[0.12em] text-stone-900 sm:block dark:text-white">LIMAJS MOTORS</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `border-b py-2 text-sm font-medium transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-stone-700 hover:text-primary dark:text-stone-200'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 text-stone-700 hover:text-primary dark:text-stone-200" aria-label={isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}>{isDarkMode ? <Sun size={19} /> : <Moon size={19} />}</button>
          <a href="https://limajs.com/api/passenger/login/" target="_blank" rel="noreferrer" className="hidden border border-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-white md:inline-flex dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-stone-900">Login</a>
          <button onClick={toggleMobileMenu} className="p-2 lg:hidden" aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-x-0 top-[77px] bottom-0 bg-white px-5 py-10 dark:bg-stone-950 lg:hidden">
            <nav className="flex flex-col" aria-label="Navigation mobile">
              {links.map((link) => <NavLink key={link.to} to={link.to} onClick={closeMobileMenu} className="border-b border-stone-200 py-5 text-2xl font-semibold dark:border-stone-800">{link.label}</NavLink>)}
              <a href="https://limajs.com/api/passenger/login/" target="_blank" rel="noreferrer" onClick={closeMobileMenu} className="mt-10 bg-primary px-6 py-4 text-center font-semibold text-white">Login</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
