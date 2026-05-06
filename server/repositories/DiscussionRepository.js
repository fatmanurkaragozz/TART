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
     * @desc    Tüm tartışmaları getir (Filtreleme ve sıralama desteği ile)
     * @param   {object} filters - { search, tag, sortBy }
     */
    async findAll(filters = {}) {
        const { search, tag, sortBy } = filters;
        
        const where = {};
        
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        
        if (tag) {
            where.tags = {
                array_contains: tag
            };
        }

        let orderBy = { createdAt: 'desc' };
        
        if (sortBy === 'popular') {
            // Prisma'da karmaşık sıralama (votes count) için bazen raw query veya aggregate gerekebilir.
            // Şimdilik en çok yorum alanları popüler sayalım (veya backend servis katmanında skorlayalım).
            orderBy = {
                comments: {
                    _count: 'desc'
                }
            };
        }

        return await prisma.discussion.findMany({
            where,
            orderBy,
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        votes: true
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
        const [discussion, upvotes, downvotes] = await Promise.all([
            prisma.discussion.findUnique({
                where: { id: id },
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
                    }
                }
            }),
            prisma.vote.count({ where: { discussionId: id, value: 1 } }),
            prisma.vote.count({ where: { discussionId: id, value: -1 } })
        ]);

        if (discussion) {
            discussion.upvotes = upvotes;
            discussion.downvotes = downvotes;
            discussion.voteScore = upvotes - downvotes;
        }

        return discussion;
    }

    /**
     * @desc    Tartışmayı güncelle
     */
    async update(id, discussionData) {
        const { title, content, tags } = discussionData;
        return await prisma.discussion.update({
            where: { id },
            data: {
                title,
                content,
                tags: tags || undefined
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

    /**
     * @desc    Trend tartışmaları getir (En çok yorumlananlar)
     */
    async findTrending() {
        return await prisma.discussion.findMany({
            take: 5,
            orderBy: {
                comments: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                title: true,
                _count: {
                    select: { comments: true }
                }
            }
        });
    }

    /**
     * @desc    Takip edilen kişilerin tartışmalarını getir
     */
    async findFollowingFeed(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    select: { id: true }
                }
            }
        });

        const followingIds = user?.following.map(f => f.id) || [];

        return await prisma.discussion.findMany({
            where: {
                authorId: { in: followingIds }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        username: true,
                        role: true
                    }
                },
                _count: {
                    select: {
                        comments: true,
                        votes: true
                    }
                }
            }
        });
    }
}


const discussionRepository = new DiscussionRepository();
export default discussionRepository;
