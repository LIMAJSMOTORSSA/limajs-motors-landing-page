/**
 * SOURCE UNIQUE DE VÉRITÉ — LIMAJS MOTORS SA
 *
 * Tout le contenu factuel du site provient EXCLUSIVEMENT des deux infolettres
 * publiées par l'entreprise :
 *   [IL-2025] Infolettre LIMAJS MOTORS SA — Juin 2025
 *   [IL-2026] Infolettre LIMAJS MOTORS SA — Août 2026
 *
 * RÈGLE : ne jamais ajouter ici un chiffre, une date, un nom, un circuit,
 * un tarif ou une statistique qui ne figure pas littéralement dans l'une des
 * deux infolettres. Chaque entrée porte sa source.
 */

// ---------------------------------------------------------------------------
// Identité — [IL-2025 §2] et [IL-2026 p.1-2]
// ---------------------------------------------------------------------------

export const identity = {
  name: 'LIMAJS MOTORS SA',
  slogan: "L'accès et l'assurance de voyager !",
  address: 'Cité du Savoir, Génipailler, Milot, Haïti',
  email: 'mainoffice@limajs.com',
  website: 'https://limajsmotors.com/',
  ceo: 'Noldey Jean Sonold Janvier', // [IL-2025] signature, Juin 2025
  ceoTitle: 'CEO',
};

// [IL-2026 p.2] « CONNECTER LES GENS ET LES COMMUNAUTÉS PAR LE TRANSPORT »
export const vision = {
  title: 'Connecter les gens et les communautés par le transport',
  body:
    "LIMAJS MOTORS SA est née d'une conviction simple mais profonde : le transport ne consiste pas " +
    "seulement à déplacer des personnes. Il consiste à créer des liens, à rapprocher les communautés " +
    "et à faciliter l'accès aux opportunités.",
  source: 'Infolettre Août 2026',
};

// [IL-2026 p.2] Mission
export const mission = {
  title:
    'Favoriser la mobilité durable des écoliers, des universitaires et des professionnels',
  body:
    "LIMAJS MOTORS SA a pour mission de favoriser la mobilité durable des écoliers, des universitaires " +
    "et des professionnels grâce à des systèmes de transport sécuritaires, accessibles et organisés.",
  source: 'Infolettre Août 2026',
};

// [IL-2026 p.2] Les trois publics de la mission
export const audiences = [
  {
    title: 'Écoliers',
    body:
      "Ils doivent pouvoir se rendre à l'école dans des conditions sécuritaires et adaptées.",
  },
  {
    title: 'Universitaires',
    body:
      "Ils ont besoin d'une mobilité fiable pour poursuivre leur formation et construire leur avenir.",
  },
  {
    title: 'Professionnels',
    body:
      'Leurs déplacements quotidiens participent au développement économique et social.',
  },
];

// [IL-2026 p.2] Les trois valeurs fondamentales
export const values = [
  {
    name: "L'Excellence",
    tagline: 'Offrir continuellement un service de qualité optimale.',
    body:
      "Par l'excellence, nous entendons la manière dont nous travaillons. Cela nous permet d'offrir un " +
      "service qualitatif, rigoureux, respectueux, sécuritaire et professionnel. Nous cherchons " +
      "constamment à améliorer nos méthodes, nos équipements, notre organisation et notre relation " +
      'avec notre clientèle.',
  },
  {
    name: 'Le Réseautage',
    tagline: 'Créer des liens pour mieux servir.',
    body:
      "Le transport est un système qui repose sur la collaboration, c'est pourquoi LIMAJS MOTORS SA " +
      'travaille continuellement à renforcer les liens entre les différents acteurs du secteur, tels que ' +
      "clients, partenaires et communautés. Nous voulons développer un réseau solide et efficace à " +
      "l'échelle locale, régionale, nationale et internationale.",
  },
  {
    name: 'La Multiplication',
    tagline: "Construire aujourd'hui un service durable pour demain.",
    body:
      'Nous voulons construire un modèle capable de se développer dans le temps et dans ' +
      "l'espace : développer progressivement nos services, élargir notre réseau, créer de nouvelles " +
      'opportunités, renforcer nos partenariats et améliorer continuellement nos capacités.',
  },
];

// ---------------------------------------------------------------------------
// Origine et service actuel — [IL-2025 §1]
// ---------------------------------------------------------------------------

export const origin = {
  founded:
    "À la fin de l'année 2021, plusieurs étudiantes et étudiants de l'ISTEAH ont pris l'initiative de " +
    "mettre en œuvre une entreprise de transport dénommée LIMAJS MOTORS SA.",
  motivation:
    "Cette initiative a été motivée par le désir de résoudre le problème de mobilité quotidienne des " +
    'écoliers, des universitaires et des professionnels de la communauté, ainsi que des membres de la ' +
    'communauté, qui rencontrent quotidiennement d’énormes difficultés pour vaquer à leurs activités.',
  launch:
    "Le 01 octobre 2024, le service a été lancé au niveau de la Cité du Savoir et quotidiennement une " +
    'quinzaine d’écoliers du Centre de la Petite Enfance Paul Gerin Lajoie et de l’École Fondamentale ' +
    'Anne Nelly Saint-Preux sont transportés de leur demeure à la Cité du Savoir et vice versa.',
  schools: [
    'Centre de la Petite Enfance Paul Gerin Lajoie',
    'École Fondamentale Anne Nelly Saint-Preux',
  ],
  source: 'Infolettre Juin 2025',
};

// ---------------------------------------------------------------------------
// Réalisations — [IL-2025 §3] « période 2023 à 2025 », tableau intégral
// ---------------------------------------------------------------------------

export const realisations = [
  ["Discussion et accord avec un service tier pour l'écriture de la première version du logo de l'entreprise", 'Février 2024', 'Complété'],
  ['Discussion avec BUSKO pour le développement d’un système informatique pour le service de transport', 'Février 2024', 'Complété'],
  ['Rencontre d’information avec les parents d’élèves, les étudiants et les employés de la Cité du Savoir', 'Mai 2024', 'Complété'],
  ['Lancement d’un sondage auprès du public cible pour l’offre du service de transport', 'Mai 2024', 'Complété'],
  ['Présentation de l’entreprise à de potentiels actionnaires', 'Juin 2024', 'Complété'],
  ['Appel à manifestation d’intérêt pour achat d’action', 'Juin 2024', 'Complété'],
  ['Appel à manifestation d’intérêt auprès du public cible pour un abonnement au service de transport', 'Juin 2024', 'Complété'],
  ['Période de dépôt d’action par les actionnaires', 'Juillet-Août 2024', 'Complété'],
  ['Période de souscription au service d’abonnement par le public cible', 'Juillet-Août 2024', 'Complété'],
  ['Préparation de carte NFC pour les usagers du service de transport', 'Juillet-Août 2024', 'Complété'],
  ['Recrutement d’une agente de sûreté (AS) pour assurer la sécurité des enfants dans le bus', 'Août 2024', 'Complété'],
  ['Achat de service de transport d’un service tier pour le lancement du service de transport', 'Août 2024', 'Complété'],
  ['Lancement du service de transport au niveau de la Cité du Savoir', 'Octobre 2024 (01)', 'Complété'],
  ['Présentation de l’entreprise au niveau du brunch 2024 de l’ISTEAH', 'Octobre 2024', 'Complété'],
  ['Mise en ligne du site internet de LIMAJS MOTORS SA (https://limajsmotors.com/)', 'Décembre 2024', 'Complété'],
  ['Développement d’application iOS et Android pour les usagers du service', 'Décembre 2024', 'Phase test'],
  ['Achat d’un bus de 18 places pour assurer l’autonomie du service', 'Décembre 2024', 'Complété'],
  ['Recrutement d’un chauffeur de bus pour le transport des usagers du service', 'Décembre 2024', 'Complété'],
  ['Sondage sur la satisfaction des usagers du service durant son lancement depuis le 01 octobre 2024', 'Décembre 2024', 'Complété'],
  ['Mise en place du domaine d’internet pour le service email de l’entreprise (mainoffice@limajs.com)', 'Janvier 2025', 'Complété'],
];

// ---------------------------------------------------------------------------
// Perspectives annoncées pour 2025-2026 — [IL-2025 §4]
// ---------------------------------------------------------------------------

export const perspectives2026 = [
  ['Nouveau sondage auprès du grand public pour l’offre de service', 'Juillet 2025'],
  ['Appel à manifestation d’intérêt pour un abonnement au service de transport', 'Juillet 2025'],
  ['Période de souscription au service d’abonnement par le public cible', 'Juillet 2025'],
  ['Recrutement d’une agente de promotion (AP)', 'Septembre 2025'],
  ['Assemblée générale', 'Septembre 2025'],
  ['Présentation de l’entreprise à de nouveaux potentiels actionnaires', 'Septembre 2025'],
  ['Lancement d’une manifestation d’intérêt pour achat d’action dans l’entreprise', 'Septembre 2025'],
  ['Reprise de service au niveau de la Cité du Savoir', 'Septembre 2025'],
  ['Distribution des certificats d’actions aux actionnaires', 'Octobre 2025'],
  ['Demande de prêt pour l’achat d’un nouveau véhicule', 'Octobre 2025'],
  ['Promotion dans les écoles, les universités et les entreprises de la ville du Cap-Haïtien', 'Octobre 2025'],
  ['Ouverture de trois nouveaux circuits pour le service', 'Sept.-Déc. 2025'],
  ['Achat d’un nouveau véhicule pour les nouveaux circuits', 'Nov.-Déc. 2025'],
  ['Recherche d’un fournisseur de kiosque d’attente', 'Mars 2026'],
  ['Achat ou préparation de kiosque d’attente', 'Juillet 2026'],
  ['Installation de kiosque d’attente pour les circuits de transport', 'Août 2026'],
  ['Discussion avec un fournisseur de carte NFC et d’un système informatique pour la vente de carte', 'Août 2026'],
  ['Mise en place d’un système de vente de carte NFC pour l’accès au service de transport', 'Août 2026'],
  ['Installation de bureau de vente de carte de transport', 'Septembre 2026'],
  ['Lancement de LIMAJS MOTORS SA au grand public', 'Décembre 2026'],
  ['Ouverture du service au grand public', 'Décembre 2026'],
];

// [IL-2025 §4] Les trois circuits annoncés (Sept.-Déc. 2025)
export const circuitsAnnonces2025 = [
  'Haut du Cap — Cité du Savoir',
  'Madeline — Cité du Savoir',
  'Cap-Haïtien — Mornes Rouges',
];

// ---------------------------------------------------------------------------
// Bilan financier — [IL-2026 p.3] « BILAN ET PERSPECTIVES »
// ---------------------------------------------------------------------------

export const bilan2026 = {
  actionnaires: 22,
  manifestationInteret: '36 460 $',
  objectifFinancement: '100 000 $',
  actionsOrdinairesVendues: 172,
  actionsPrivilegieesVendues: 227,
  collecteUSD: '19 837,95 USD',
  collecteHTG: '441 353,00 HTG',
  usageCollecte:
    "Cette collecte nous a permis d'acheter un véhicule usagé et de couvrir certaines dépenses durant la période.",
  chiffreAffaires2026: '1 439 150,00 HTG',
  source: 'Infolettre Août 2026',
};

// [IL-2026 p.3] Offre d'actions en cours
export const offreActions = {
  ordinaires: { nombre: 228, prix: '80,00 USD' },
  privilegiees: { nombre: 453, prix: '100,00 USD' },
  tauxObjectif: '63,54 %',
  objectif: '100 000,00 USD',
  source: 'Infolettre Août 2026',
};

// [IL-2026 p.3] Perspectives 2026-2027
export const perspectives20262027 = [
  'Ouvrir un nouveau circuit entre Cap-Haïtien et Morne-Rouge',
  'Augmenter sa flotte de véhicules en passant à deux véhicules',
  'Diversifier ses services en s’investissant dans le transport de colis',
  'Diversifier ses services en s’investissant dans la location de motos',
];

// [IL-2026 p.3] « UNE TROISIÈME ANNÉE VERS LE PROGRÈS »
export const troisiemeAnnee = [
  [
    'Plus de sécurité',
    'En vue de continuer à renforcer les standards de sécurité liés au transport et à la prise en charge de nos enfants.',
  ],
  [
    'Plus de qualité',
    "En améliorant constamment l'expérience que nous offrons à nos clients fidèles.",
  ],
  [
    'Plus de connexions',
    'En créant un réseau de transport toujours plus efficace et intégré pour couvrir les zones à haut potentiel.',
  ],
  [
    'Plus de développement',
    'En faisant grandir progressivement nos capacités et nos services afin de répondre à une demande de plus en plus croissante.',
  ],
];

// ---------------------------------------------------------------------------
// Partenariats — [IL-2026 p.3] et [IL-2025 §3]
// ---------------------------------------------------------------------------

export const partners = [
  {
    name: 'BUSKO',
    description:
      "Partenariat pour une application de gestion des services de transport. Les discussions pour le " +
      "développement d'un système informatique ont débuté en février 2024.",
    sources: ['Infolettre Août 2026', 'Infolettre Juin 2025'],
  },
  {
    name: 'ISTEAH',
    description:
      "Institut à l'origine de l'initiative : l'entreprise a été mise en œuvre fin 2021 par des étudiantes " +
      "et étudiants de l'ISTEAH. Partenariat pour le transport d'écoliers, à partir de PIGraN Solidarité.",
    sources: ['Infolettre Juin 2025', 'Infolettre Août 2026'],
  },
  {
    name: 'PIGraN',
    description:
      "Le partenariat avec l'ISTEAH pour le transport d'écoliers est développé à partir de PIGraN Solidarité.",
    sources: ['Infolettre Août 2026'],
  },
  {
    name: 'GRAHN',
    description:
      "Figure parmi les partenaires institutionnels présentés par LIMAJS MOTORS SA.",
    sources: ['Visuel officiel des partenaires'],
  },
];

// ---------------------------------------------------------------------------
// Cartes d'accès — [IL-2025 p.14] « Cartes d'accès aux bus »
// ---------------------------------------------------------------------------

export const cartesAcces = [
  { key: 'etudiants', label: "Carte d'accès étudiants(es)" },
  { key: 'ecoliers', label: "Carte d'accès écoliers" },
  { key: 'employes', label: "Carte d'accès employé(e)s" },
];

// ---------------------------------------------------------------------------
// Promesse — [IL-2026 p.4] « NOTRE PROMESSE »
// ---------------------------------------------------------------------------

export const promesse = {
  intro:
    'Nous construisons un service de transport reconnu pour sa qualité et sa capacité à créer des ' +
    'connexions entre les personnes et les communautés, où :',
  items: [
    'chaque enfant peut accéder à son école en sécurité',
    'chaque étudiant peut rejoindre son université avec confiance',
    'chaque professionnel peut se déplacer efficacement',
    'chaque communauté peut être mieux connectée',
    'chaque partenaire peut trouver dans le transport une opportunité de développement',
  ],
  conclusion:
    "En somme, nous ne voulons pas simplement être une entreprise qui transporte des personnes, mais " +
    'un acteur incontournable de la mobilité et du développement communautaire.',
  source: 'Infolettre Août 2026',
};

// [IL-2026 p.1] Bilan des deux premières années
export const bilanDeuxAns = {
  intro:
    "Étant reconnaissant des deux années de réussite, LIMAJS MOTORS SA s'apprête à entamer sa " +
    'troisième année de service, un pari sur le succès !',
  body:
    "Depuis le début du service en 2024, ce parcours est marqué par des expériences enrichissantes, des " +
    'défis importants, des moments de remise en question, mais surtout par une volonté constante de ' +
    "servir, d'apprendre, d'améliorer et de construire un service de transport fiable, sécuritaire et " +
    'accessible à tous.',
  challenges:
    "Le parcours de LIMAJS MOTORS SA n'a pas été facile. Comme toute jeune entreprise, nous avons dû " +
    'faire face à des difficultés, à des imprévus et à des situations qui ont mis à l’épreuve notre ' +
    'capacité d’adaptation. Mais chaque difficulté nous a permis d’apprendre et de grandir.',
  source: 'Infolettre Août 2026',
};
