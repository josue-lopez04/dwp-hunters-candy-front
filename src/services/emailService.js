// src/services/emailService.js (para el backend)
import nodemailer from 'nodemailer';

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // True para usar SSL
  auth: {
    user: 'josuelopezhernandez112@gmail.com',
    pass: 'zawh elwn olpv vdoi'
  },
  tls: {
    rejectUnauthorized: false  
  }
});

/**
 * Envía un correo de recuperación de contraseña
 * @param {string} to - Email del destinatario
 * @param {string} token - Token de recuperación
 * @param {string} username - Nombre de usuario
 * @returns {Promise} Resultado del envío
 */
export const sendPasswordResetEmail = async (to, token, username) => {
  try {
    // Construir URL de reset (frontend)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
    
    // Template del correo
    const mailOptions = {
      from: '"Hunter\'s Candy" <josuelopezhernandez112@gmail.com>',
      to,
      subject: 'Recuperación de contraseña - Hunter\'s Candy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="Hunter's Candy Logo" style="max-width: 150px;">
          </div>
          
          <h2 style="color: #111827; margin-bottom: 20px;">Recuperación de contraseña</h2>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Hola ${username || 'Usuario'},</p>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer contraseña</a>
          </div>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. El enlace expirará en 1 hora por seguridad.</p>
          
          <p style="color: #4b5563; margin-bottom: 5px;">Si tienes problemas con el botón, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
          <p style="color: #4b5563; margin-bottom: 20px; word-break: break-all; font-size: 14px;">
            <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a>
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px; font-size: 14px; color: #6b7280; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Hunter's Candy. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.jpeg',
          path: './public/logo.jpeg', // Ruta relativa al logo en el servidor
          cid: 'logo' // ID usado en el src del img tag
        }
      ]
    };
    
    // Enviar correo
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    throw error;
  }
};

/**
 * Envía una notificación de cambio de contraseña exitoso
 * @param {string} to - Email del destinatario
 * @param {string} username - Nombre de usuario
 * @returns {Promise} Resultado del envío
 */
export const sendPasswordChangedEmail = async (to, username) => {
  try {
    const mailOptions = {
      from: '"Hunter\'s Candy" <josuelopezhernandez112@gmail.com>',
      to,
      subject: 'Tu contraseña ha sido cambiada - Hunter\'s Candy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="Hunter's Candy Logo" style="max-width: 150px;">
          </div>
          
          <h2 style="color: #111827; margin-bottom: 20px;">Contraseña actualizada correctamente</h2>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Hola ${username || 'Usuario'},</p>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Iniciar sesión</a>
          </div>
          
          <p style="color: #4b5563; margin-bottom: 20px;">Si no realizaste este cambio, por favor contacta inmediatamente con nuestro equipo de soporte.</p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px; font-size: 14px; color: #6b7280; text-align: center;">
            <p>&copy; ${new Date().getFullYear()} Hunter's Candy. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.jpeg',
          path: './public/logo.jpeg',
          cid: 'logo'
        }
      ]
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de confirmación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error al enviar correo de confirmación:', error);
    throw error;
  }
};

export default {
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};