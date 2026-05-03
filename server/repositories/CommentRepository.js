import prisma from '../config/prisma.js';

/**
 * @description Yorum Veri Erişim Katmanı (Prisma ORM)
 */
class CommentRepository {
    /**
     * @desc    Yeni yorum oluştur
     */
    async create(commentData) {
        return await prisma.comment.create({
            data: {
                content: commentData.content,
                authorId: commentData.authorId,
                discussionId: commentData.discussionId,
                parentId: commentData.parentId || null
            }
        });
    }

    /**
     * @desc    ID'ye göre yorum getir
     */
    async findById(id) {
        return await prisma.comment.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                },
                votes: true
            }
        });
    }

    /**
     * @desc    ID'ye göre yorum sil
     */
    async delete(id) {
        return await prisma.comment.delete({
            where: { id }
        });
    }

    /**
     * @desc    ID'ye göre yorum güncelle
     */
    async update(id, content) {
        return await prisma.comment.update({
            where: { id },
            data: { content }
        });
    }

    async vote(commentId, userId, value) {
        // Önce eski oyu kontrol et
        const existingVote = await prisma.vote.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        if (existingVote) {
            if (existingVote.value === value) {
                // Aynı yönde oy verilirse oyu sil (iptal et)
                return await prisma.vote.delete({
                    where: { id: existingVote.id }
                });
            } else {
                // Farklı yönde oy verilirse oyu güncelle
                return await prisma.vote.update({
                    where: { id: existingVote.id },
                    data: { value }
                });
            }
        }

        // Yeni oy oluştur
        return await prisma.vote.create({
            data: {
                value,
                userId,
                commentId
            }
        });
    }
}

const commentRepository = new CommentRepository();
export default commentRepository;
