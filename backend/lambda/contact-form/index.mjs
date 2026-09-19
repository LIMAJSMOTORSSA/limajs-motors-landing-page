import { Resend } from 'resend';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient();
let resendClient = null;
let adminEmails = [];
let fromEmail = '';

const MAX_LENGTHS = { name: 100, email: 150, phone: 30, message: 2000 };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Helper to get configuration
async function loadConfiguration() {
    const secretName = process.env.SECRET_NAME;
    if (!secretName) {
        throw new Error("SECRET_NAME environment variable is not set.");
    }

    try {
        const response = await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT",
            })
        );

        if (response.SecretString) {
            return JSON.parse(response.SecretString);
        }

        throw new Error("SecretString is empty.");
    } catch (error) {
        console.error("Error retrieving secret:", error);
        throw error;
    }
}

// Helper to format JSON response for API Gateway
const response = (statusCode, body) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify(body)
});

/**
 * Échappe le HTML. Les valeurs proviennent d'un formulaire public : sans
 * échappement, un visiteur pourrait injecter du balisage dans l'email reçu
 * par l'équipe.
 */
const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

// Conserve les sauts de ligne du message dans l'email HTML.
const escapeHtmlMultiline = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');

// L'API Gateway HTTP API (payload v2.0) expose la méthode ici ; l'ancien
// format REST utilisait event.httpMethod.
const getMethod = (event) =>
    event?.requestContext?.http?.method || event?.httpMethod || '';

const getBody = (event) => {
    if (!event?.body) return {};
    const raw = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8')
        : event.body;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const handler = async (event) => {
    // Handle CORS Preflight
    if (getMethod(event) === 'OPTIONS') {
        return response(200, {});
    }

    try {
        // Lazy Load Configuration
        if (!resendClient) {
            const config = await loadConfiguration();

            const apiKey = config.RESEND_API_KEY;
            if (!apiKey || apiKey === 'placeholder_key') {
                console.error("RESEND_API_KEY is not configured.");
                return response(500, { success: false, message: "Le service de messagerie n'est pas configuré." });
            }

            resendClient = new Resend(apiKey);

            const adminEmailsStr = config.ADMIN_EMAILS || 'limajsmotorssa@gmail.com,mainoffice@limajs.com';
            adminEmails = adminEmailsStr.split(',').map(e => e.trim()).filter(Boolean);

            fromEmail = config.FROM_EMAIL || 'contact@limajs.com';
        }

        const body = getBody(event);
        if (body === null) {
            return response(400, { success: false, message: "Requête invalide." });
        }

        const name = String(body.name ?? '').trim();
        const email = String(body.email ?? '').trim();
        const phone = String(body.phone ?? '').trim();
        const message = String(body.message ?? '').trim();
        // Champ piège : invisible pour un humain, rempli par les robots.
        const honeypot = String(body.company ?? '').trim();

        // Anti-spam : on répond 200 pour ne pas renseigner le robot.
        if (honeypot) {
            console.warn("Honeypot triggered, message dropped.");
            return response(200, { success: true, message: "Message envoyé avec succès!" });
        }

        // Validation
        if (!name || !email || !message) {
            return response(400, { success: false, message: "Veuillez remplir votre nom, votre email et votre message." });
        }
        if (!EMAIL_REGEX.test(email)) {
            return response(400, { success: false, message: "Format d'email invalide." });
        }
        if (message.length < 10) {
            return response(400, { success: false, message: "Votre message doit contenir au moins 10 caractères." });
        }
        for (const [field, max] of Object.entries(MAX_LENGTHS)) {
            const value = { name, email, phone, message }[field];
            if (value.length > max) {
                return response(400, { success: false, message: `Le champ « ${field} » dépasse ${max} caractères.` });
            }
        }

        // 1. Send Notification to Admin
        const adminEmailData = await resendClient.emails.send({
            from: fromEmail,
            to: adminEmails,
            // Permet de répondre directement au visiteur depuis la boîte de réception.
            replyTo: email,
            subject: `Nouveau message de ${name} (site web LIMAJS MOTORS)`,
            html: `
        <h2>Nouveau contact via le site web</h2>
        <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone:</strong> ${phone ? escapeHtml(phone) : 'Non renseigné'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">${escapeHtmlMultiline(message)}</blockquote>
      `
        });

        if (adminEmailData.error) {
            console.error("Resend Admin Error:", adminEmailData.error);
            throw new Error("Failed to send admin notification.");
        }

        // 2. Send Auto-Reply to User (best effort : ne doit pas faire échouer l'envoi)
        try {
            const userEmailData = await resendClient.emails.send({
                from: fromEmail,
                to: email,
                subject: "Nous avons bien reçu votre message — LIMAJS MOTORS SA",
                html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bonjour ${escapeHtml(name)},</h2>
          <p>Merci d'avoir contacté <strong>LIMAJS MOTORS SA</strong> via notre site web.</p>
          <p>Nous avons bien reçu votre message et notre équipe vous répondra dans les plus brefs délais.</p>
          <br>
          <p>Cordialement,</p>
          <p><strong>L'équipe LIMAJS MOTORS SA</strong></p>
          <p style="color: #666;">L'accès et l'assurance de voyager !</p>
          <hr>
          <p style="font-size: 12px; color: #888;">Ceci est un message automatique, merci de ne pas y répondre directement.</p>
        </div>
      `
            });

            if (userEmailData.error) {
                console.log("Auto-reply warning:", userEmailData.error);
            }
        } catch (autoReplyError) {
            console.log("Auto-reply failed:", autoReplyError);
        }

        return response(200, { success: true, message: "Message envoyé avec succès!" });

    } catch (error) {
        console.error("Handler Error:", error);
        return response(500, { success: false, message: "Erreur interne du serveur." });
    }
};
