import prisma from '../config/prisma.js';

/**
 * @description Tartışma Veri Erişim Katmanı (Prisma ORM)
 */
class DiscussionRepository {
    /**
     * @desc    Yeni tartışma oluştur
     * @param   {object} discussionData
     */
    async create(discussionData) {
        const { title, content, authorId, tags } = discussionData;
        
        return await prisma.discussion.create({
            data: {
                title,
                content,
                authorId,
                tags: tags || []
            }
        });
    }

    /**
     * @desc    Tüm tartışmaları getir
     */
    async findAll() {
        return await prisma.discussion.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                }
            }
        });
    }

    /**
     * @desc    ID'ye göre tartışma getir (Yorumlar ve Oy Sayısı ile)
     * @param   {string} id
     */
    async findById(id) {
        return await prisma.discussion.findUnique({
            where: {
                id: id
            },
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                username: true
                            }
                        },
                        votes: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                votes: true
            }
        });
    }

    /**
     * @desc    Tartışmayı sil
     * @param   {string} id
     */
    async delete(id) {
        return await prisma.discussion.delete({
            where: {
                id: id
            }
        });
    }
}


const discussionRepository = new DiscussionRepository();
export default discussionRepository;
