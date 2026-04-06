import prisma from '../config/prisma.js';

/**
 * @description Oylama (Beğeni/Etkileşim) Veri Erişim Katmanı
 */
class VoteRepository {
    /**
     * @desc    Tartışmaya oy ver (Upvote/Downvote)
     */
    async voteDiscussion(discussionId, userId, value) {
        // Mevcut oyu kontrol et (upsert kullanarak değiştir veya ekle)
        return await prisma.vote.upsert({
            where: {
                userId_discussionId: {
                    userId,
                    discussionId
                }
            },
            update: {
                value
            },
            create: {
                userId,
                discussionId,
                value
            }
        });
    }

    /**
     * @desc    Yorum oyla
     */
    async voteComment(commentId, userId, value) {
        return await prisma.vote.upsert({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            },
            update: {
                value
            },
            create: {
                userId,
                commentId,
                value
            }
        });
    }

    /**
     * @desc    Oy sil (Geri çekme)
     */
    async deleteVote(userId, discussionId = null, commentId = null) {
        if (discussionId) {
            return await prisma.vote.deleteMany({
                where: { userId, discussionId }
            });
        }
        if (commentId) {
            return await prisma.vote.deleteMany({
                where: { userId, commentId }
            });
        }
    }
}

const voteRepository = new VoteRepository();
export default voteRepository;
