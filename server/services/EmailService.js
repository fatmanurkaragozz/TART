import nodemailer from 'nodemailer';

/**
 * @description E-posta Servis Katmanı
 */
class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // 465 portu SSL/TLS gerektirir
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    /**
     * @desc    Hoş geldin e-postası gönder
     * @param   {string} to 
     * @param   {string} username 
     */
    async sendWelcomeEmail(to, username) {
        const mailOptions = {
            from: `"TART Ekibi" <${process.env.EMAIL_FROM || 'noreply@tart.com'}>`,
            to,
            subject: 'TART\'a Hoş Geldiniz! 🚀',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4f46e5; margin-bottom: 10px;">Merhaba ${username}!</h1>
                        <p style="font-size: 18px; color: #374151;">TART topluluğuna katıldığın için çok mutluyuz.</p>
                    </div>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <p style="margin-top: 0; color: #4b5563;">Artık tartışmalara katılabilir, sorularını sorabilir ve diğer geliştiricilerle etkileşime geçebilirsin.</p>
                        <p style="color: #4b5563;">Hesabın başarıyla oluşturuldu ve seni aramızda görmek harika.</p>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Hemen Keşfetmeye Başla</a>
                    </div>

                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>Bu e-posta otomatik olarak gönderilmiştir, lütfen yanıtlamayınız.</p>
                        <p>&copy; 2024 TART Project. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${to}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }

    /**
     * @desc    Şifre sıfırlama e-postası gönder
     * @param   {string} to 
     * @param   {string} resetUrl 
     */
    async sendPasswordResetEmail(to, resetUrl) {
        const mailOptions = {
            from: `"TART Destek" <${process.env.EMAIL_FROM || 'support@tart.com'}>`,
            to,
            subject: 'Şifre Sıfırlama Talebi',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #4f46e5; margin-bottom: 10px;">Şifre Sıfırlama</h1>
                        <p style="font-size: 16px; color: #374151;">Şifreni sıfırlamak için bir talep aldık.</p>
                    </div>
                    
                    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ef4444;">
                        <p style="margin-top: 0; color: #991b1b;">Eğer bu talebi sen yapmadıysan, bu e-postayı görmezden gelebilirsin. Şifren güvende kalacaktır.</p>
                    </div>

                    <p style="color: #4b5563; line-height: 1.6;">Şifreni sıfırlamak için aşağıdaki butona tıkla. Bu bağlantı 10 dakika içinde sona erecektir.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
                    </div>

                    <p style="color: #9ca3af; font-size: 14px;">Eğer buton çalışmıyorsa, bu bağlantıyı tarayıcına yapıştırabilirsin:</p>
                    <p style="word-break: break-all; font-size: 12px; color: #4f46e5;">${resetUrl}</p>

                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                        <p>TART Ekibi</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${to}`);
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    }
}

const emailService = new EmailService();
export default emailService;
