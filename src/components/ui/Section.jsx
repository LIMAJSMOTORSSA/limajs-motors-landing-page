// src/components/ui/Section.jsx
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Importer les animations depuis les utils
import { fadeInUp, scrollReveal, observerConfig } from '../../utils/animations';

const Section = ({
  id,
  title,
  subtitle,
  children,
  className = '',
  bgColor = 'bg-white dark:bg-gray-900',
  containerClassName = '',
  titleClassName = '',
  subtitleClassName = '',
  contentClassName = '',
  withAnimation = true,
  titleAnimation = fadeInUp,
  contentAnimation = scrollReveal,
  titleAs = 'h2',
  subtitleAs = 'p',
}) => {
  // Animer les éléments au défilement
  const variants = {
    title: titleAnimation,
    content: contentAnimation
  };

  // Pour le composant de titre
  const HeadingTag = titleAs;
  const SubheadingTag = subtitleAs;

  return (
    <section id={id} className={`py-20 md:py-28 ${bgColor} ${className}`}>
      <div className={`container mx-auto max-w-[1440px] px-5 md:px-10 lg:px-16 ${containerClassName}`}>
        {/* En-tête de section avec titre et sous-titre */}
        {(title || subtitle) && (
          <div className="mb-12 md:mb-16 max-w-4xl">
            {title && (
              <motion.div
                initial={withAnimation ? "hidden" : false}
                whileInView={withAnimation ? "visible" : false}
                viewport={observerConfig}
                variants={variants.title}
                className="mb-4"
              >
                <HeadingTag 
                  className={`text-4xl md:text-6xl font-semibold tracking-[-0.045em] leading-[0.96] ${titleClassName}`}
                >
                  {title}
                </HeadingTag>
              </motion.div>
            )}
            
            {subtitle && (
              <motion.div
                initial={withAnimation ? "hidden" : false}
                whileInView={withAnimation ? "visible" : false}
                viewport={observerConfig}
                variants={variants.title}
                className="mt-4"
              >
                <SubheadingTag 
                  className={`text-lg md:text-xl leading-relaxed text-stone-600 dark:text-stone-300 max-w-2xl ${subtitleClassName}`}
                >
                  {subtitle}
                </SubheadingTag>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Contenu principal de la section */}
        <motion.div
          initial={withAnimation ? "hidden" : false}
          whileInView={withAnimation ? "visible" : false}
          viewport={observerConfig}
          variants={variants.content}
          className={contentClassName}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

Section.propTypes = {
  id: PropTypes.string,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  containerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  subtitleClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  withAnimation: PropTypes.bool,
  titleAnimation: PropTypes.object,
  contentAnimation: PropTypes.object,
  titleAs: PropTypes.string,
  subtitleAs: PropTypes.string,
};

export default Section;
