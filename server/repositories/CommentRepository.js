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
                discussionId: commentData.discussionId
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
}

const commentRepository = new CommentRepository();
export default commentRepository;
