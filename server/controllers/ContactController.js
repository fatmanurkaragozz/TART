import prisma from '../config/prisma.js';
import nodemailer from 'nodemailer';
import ApiError from '../utils/ApiError.js';

class ContactController {
    /**
     * @desc    İletişim mesajı gönder
     * @route   POST /api/v1/contact
     */
    async sendMessage(req, res, next) {
        try {
            const { name, email, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                throw new ApiError(400, 'Lütfen tüm alanları doldurun');
            }

            // 1. Veritabanına kaydet
            const newMessage = await prisma.contactMessage.create({
                data: { name, email, subject, message }
            });

            // 2. Admin'e e-posta gönder
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'tart.platform4@gmail.com',
                    pass: process.env.EMAIL_PASS // .env dosyasında uygulama şifresi olmalı
                }
            });

            const mailOptions = {
                from: email,
                to: 'tart.platform4@gmail.com',
                subject: `TART İletişim: ${subject}`,
                text: `Gönderen: ${name} (${email})\n\nMesaj:\n${message}`
            };

            // E-posta gönderimi başarısız olsa bile veritabanına kaydedildiği için başarı dönebiliriz
            // Ama gerçek bir senaryoda hata yönetimi yapılmalı
            transporter.sendMail(mailOptions).catch(err => console.error('Email gönderim hatası:', err));

            res.status(201).json({
                success: true,
                message: 'Mesajınız başarıyla iletildi',
                data: newMessage
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Tüm mesajları getir (Admin için)
     * @route   GET /api/v1/contact
     */
    async getAllMessages(req, res, next) {
        try {
            const messages = await prisma.contactMessage.findMany({
                orderBy: { createdAt: 'desc' }
            });

            res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Mesajı okundu işaretle
     * @route   PUT /api/v1/contact/:id/read
     */
    async markAsRead(req, res, next) {
        try {
            const { id } = req.params;
            await prisma.contactMessage.update({
                where: { id },
                data: { isRead: true }
            });

            res.status(200).json({
                success: true,
                message: 'Mesaj okundu olarak işaretlendi'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ContactController();
