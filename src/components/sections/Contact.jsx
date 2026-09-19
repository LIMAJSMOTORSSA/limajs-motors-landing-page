import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { MapPin, Phone, Mail, Send, Check } from 'lucide-react';

// Composants
import Section from '../ui/Section';
import Button from '../ui/Button';

// Utilitaires
import { isValidEmail, isValidHaitianPhone } from '../../utils/helpers';

const CONTACT_EMAIL = 'mainoffice@limajs.com';

/**
 * Base de l'API. La sortie CDK `httpApi.url` se termine par « / », ce qui
 * produirait « //contact » et une 404 : on retire la barre finale.
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

const ContactInfo = ({ icon: Icon, title, content, link, linkType }) => {
  let linkProps = {};

  if (link) {
    switch (linkType) {
      case 'phone':
        linkProps.href = `tel:${link}`;
        break;
      case 'email':
        linkProps.href = `mailto:${link}`;
        break;
      case 'map':
        linkProps.href = link;
        linkProps.target = '_blank';
        linkProps.rel = 'noopener noreferrer';
        break;
      default:
        linkProps.href = link;
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="border-l-2 border-primary pl-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        {link ? (
          <a
            {...linkProps}
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
          >
            {content}
          </a>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">{content}</p>
        )}
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  link: PropTypes.string,
  linkType: PropTypes.oneOf(['phone', 'email', 'map'])
};

const Contact = () => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    // Champ piège anti-robot : laissé vide par un visiteur humain.
    company: ''
  });

  // État des erreurs du formulaire
  const [formErrors, setFormErrors] = useState({});

  // État de soumission du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mettre à jour les données du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Supprimer l'erreur correspondante si le champ est modifié
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    // Valider le nom
    if (!formData.name.trim()) {
      errors.name = "Veuillez entrer votre nom";
    }

    // Valider l'email
    if (!formData.email.trim()) {
      errors.email = "Veuillez entrer votre email";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Veuillez entrer un email valide";
    }

    // Valider le numéro de téléphone (si renseigné)
    if (formData.phone && !isValidHaitianPhone(formData.phone)) {
      errors.phone = "Veuillez entrer un numéro de téléphone haïtien valide";
    }

    // Valider le message
    if (!formData.message.trim()) {
      errors.message = "Veuillez entrer votre message";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Votre message doit contenir au moins 10 caractères";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider le formulaire
    if (!validateForm()) return;

    // Indiquer que le formulaire est en train d'être soumis
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (!API_BASE_URL) {
        // Aucun backend configuré : on ne prétend pas que le message est parti.
        throw new Error("Le formulaire n'est pas disponible pour le moment.");
      }

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'envoi du message");
      }

      // Succès
      setIsSubmitted(true);

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        company: ''
      });
    } catch (error) {
      // Gérer l'erreur
      console.error("Erreur lors de l'envoi du message:", error);
      setSubmitError(
        error.message || "Une erreur s'est produite. Veuillez réessayer plus tard."
      );
    } finally {
      // Terminer la soumission
      setIsSubmitting(false);
    }
  };

  // Informations de contact
  const contactInfo = [
    {
      icon: MapPin,
      title: "Notre Adresse",
      content: "Génipailler, 3e Section Milot",
      link: "https://maps.google.com/?q=Genipailler,Milot,Haiti",
      linkType: "map"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+509 41 70 4234",
      link: "+50941704234",
      linkType: "phone"
    },
    {
      icon: Mail,
      title: "Email",
      content: "mainoffice@limajs.com",
      link: "mainoffice@limajs.com",
      linkType: "email"
    }
  ];

  return (
    <Section
      id="contact"
      title="Entrer en Contact"
      subtitle="Nous sommes là pour répondre à vos questions et vous aider dans vos déplacements."
      bgColor="bg-[#f6f4ef] dark:bg-stone-950"
    >
      <div className="grid md:grid-cols-2 gap-12">
        {/* Informations de contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {contactInfo.map((info) => (
            <ContactInfo
              key={info.title}
              icon={info.icon}
              title={info.title}
              content={info.content}
              link={info.link}
              linkType={info.linkType}
            />
          ))}

          {/* Carte Google Maps intégrée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 aspect-video overflow-hidden border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30106.80393651724!2d-72.22648968700048!3d19.606071042656377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1f0262e1bb5eb%3A0xae7549560a3dc5a6!2sMilot!5e0!3m2!1sfr!2sht!4v1708864584371!5m2!1sfr!2sht"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Carte LIMAJS MOTORS"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </motion.div>

        {/* Formulaire de contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="border-t-4 border-primary bg-white p-6 dark:bg-stone-900 md:p-10"
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Message envoyé avec succès!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Envoyer un autre message
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Envoyez-nous un message</h3>

              {/* Champ piège anti-robot : masqué, jamais rempli par un visiteur. */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                <label htmlFor="company">Ne pas remplir</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-stone-800 dark:text-white`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-stone-800 dark:text-white`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-stone-800 dark:text-white`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-stone-800 dark:text-white`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  <p>{submitError}</p>
                  <p className="mt-2 text-sm">
                    Vous pouvez aussi nous écrire à{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                icon={Send}
                isLoading={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </Section>
  );
};

export default Contact;
