// src/utils/seo.js
import { organizationSchema, serviceSchema } from './schema';

/**
 * Métadonnées SEO pour les pages principales
 * À utiliser avec React Helmet ou React Helmet Async
 */

// Métadonnées de base qui s'appliquent à tout le site
export const defaultSeoData = {
  title: "LIMAJS MOTORS SA | Votre transport en bus moderne à Cap-Haïtien",
  description: "LIMAJS MOTORS SA favorise la mobilité durable des écoliers, des universitaires et des professionnels. Service lancé le 01 octobre 2024 à la Cité du Savoir, Milot.",
  keywords: "LIMAJS MOTORS, transport scolaire Milot, Cité du Savoir, mobilité durable Haïti, transport Nord Haïti",
  canonical: "https://www.limajsmotorssaht.com/",
  locale: "fr_FR",
  ogType: "website",
  twitterCard: "summary_large_image",
  ogImage: "https://www.limajsmotorssaht.com/images/og-image.jpg", // 1200x630px recommandé
  twitterImage: "https://www.limajsmotors.com/images/twitter-image.jpg", // 1200x600px recommandé
  siteUrl: "https://www.limajsmotors.com",
};

// Métadonnées pour la page d'accueil
export const homeSeoData = {
  ...defaultSeoData,
  schema: organizationSchema,
};

// Métadonnées pour la page Services
export const servicesSeoData = {
  ...defaultSeoData,
  title: "Nos Services de Transport | LIMAJS MOTORS",
  description: "Transport des écoliers à la Cité du Savoir depuis octobre 2024, abonnements, et services annoncés pour 2026-2027 : location de motos et transport de colis.",
  keywords: "transport scolaire Cité du Savoir, abonnement LIMAJS MOTORS, location de motos Haïti, transport de colis Nord Haïti",
  canonical: "https://www.limajsmotors.com/services",
  schema: serviceSchema,
};

// Métadonnées pour la page À Propos
export const aboutSeoData = {
  ...defaultSeoData,
  title: "À Propos de LIMAJS MOTORS | Notre Histoire et Équipe",
  description: "LIMAJS MOTORS SA, initiative lancée fin 2021 par des étudiantes et étudiants de l'ISTEAH. Vision, mission, valeurs et réalisations publiées dans nos infolettres.",
  keywords: "LIMAJS MOTORS histoire, ISTEAH transport, mission LIMAJS MOTORS, réalisations LIMAJS MOTORS",
  canonical: "https://www.limajsmotors.com/a-propos",
};

// Métadonnées pour la page Investir
export const investSeoData = {
  ...defaultSeoData,
  title: "Opportunités d'Investissement | LIMAJS MOTORS",
  description: "Bilan et offre d'actions de LIMAJS MOTORS SA : 22 actionnaires, actions ordinaires à 80 USD et privilégiées à 100 USD, selon l'infolettre d'août 2026.",
  keywords: "actions LIMAJS MOTORS, actionnaires LIMAJS MOTORS, investir transport Haïti, actions ordinaires privilégiées",
  canonical: "https://www.limajsmotors.com/investir",
};

// Métadonnées pour la page Partenaires
export const partnersSeoData = {
  ...defaultSeoData,
  title: "Nos Partenaires | LIMAJS MOTORS",
  description: "Les partenaires de LIMAJS MOTORS SA : BUSKO, ISTEAH, PIGraN et GRAHN.",
  keywords: "partenaires LIMAJS MOTORS, BUSKO, ISTEAH, GRAHN, PIGraN, partenariat transport Haïti",
  canonical: "https://www.limajsmotors.com/partenaires",
};

// Métadonnées pour la page Contact
export const contactSeoData = {
  ...defaultSeoData,
  title: "Contactez LIMAJS MOTORS | Transport Cap-Haïtien",
  description: "Contactez LIMAJS MOTORS SA à la Cité du Savoir, Génipailler, Milot, Haïti. Formulaire de contact, adresse, téléphone et email.",
  keywords: "contact LIMAJS MOTORS, téléphone transport Cap-Haïtien, adresse bus Haïti, email LIMAJS MOTORS",
  canonical: "https://www.limajsmotors.com/contact",
};

/**
 * Fonction pour générer les balises meta pour une page spécifique
 * @param {Object} seoData - Données SEO pour la page
 * @returns {Object} - Objet contenant toutes les balises meta
 */
export const generateSeoTags = (seoData) => {
  const { title, description, keywords, canonical, locale, ogType, ogImage, twitterCard, twitterImage, schema } = seoData;
  
  return {
    title: title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:locale', content: locale },
      { property: 'og:site_name', content: 'LIMAJS MOTORS' },
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: twitterImage },
      { name: 'robots', content: 'index, follow' },
    ],
    link: [
      { rel: 'canonical', href: canonical }
    ],
    schema: schema,
  };
};
