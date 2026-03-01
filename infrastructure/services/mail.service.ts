import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Esto soluciona problemas de certificados en redes locales o con antivirus
    rejectUnauthorized: false,
  },
});

export const MailService = {
  /**
   * Envía un correo electrónico genérico.
   */
  async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const info = await transporter.sendMail({
        from: `"Garden Ads" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log("✅ Email enviado correctamente:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Error enviando email:", error);
      throw error;
    }
  },

  /**
   * Plantilla para recuperación de contraseña.
   */
  async sendPasswordResetEmail(email: string, url: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Garden Ads</h1>
        </div>
        <div style="padding: 30px; color: #1f2937;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">Recuperar tu contraseña</h2>
          <p style="line-height: 1.5; margin-bottom: 30px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
            Si no hiciste esta solicitud, puedes ignorar este correo tranquilamente.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
              Restablecer Contraseña
            </a >
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            Si el botón de arriba no funciona, copia y pega el siguiente enlace en tu navegador:
            <br>
            <a href="${url}" style="color: #10b981;">${url}</a>
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          <p>© 2026 Garden Ads. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Recuperá tu contraseña - Garden Ads",
      html,
    });
  },

  /**
   * Plantilla para verificación de email.
   */
  async sendVerificationEmail(email: string, url: string) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Garden Ads</h1>
        </div>
        <div style="padding: 30px; color: #1f2937;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px;">¡Bienvenido a Garden Ads!</h2>
          <p style="line-height: 1.5; margin-bottom: 30px;">
            Gracias por registrarte. Para empezar a usar la plataforma, necesitamos que confirmes tu dirección de correo electrónico.
          </p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${url}" style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
              Confirmar mi Email
            </a>
          </div>
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
            Si no creaste esta cuenta, puedes ignorar este correo.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          <p>© 2026 Garden Ads. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Verificá tu cuenta - Garden Ads",
      html,
    });
  },
};
