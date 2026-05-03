import DiscussionRepository from '../repositories/DiscussionRepository.js';
import VoteRepository from '../repositories/VoteRepository.js';
import NotificationService from './NotificationService.js';
import ModerationService from './ModerationService.js';

class DiscussionService {
    async createNewDiscussion(data) {
        if (data.title.length < 5) {
            throw new Error('Başlık en az 5 karakter olmalıdır');
        }

        // AI Moderasyon Kontrolü (Hafta 5)
        const titleMod = await ModerationService.analyzeText(data.title);
        const contentMod = await ModerationService.analyzeText(data.content);

        if (!titleMod.isSafe || !contentMod.isSafe) {
            throw new Error('Tartışma başlığı veya içeriği topluluk kurallarını ihlal ediyor olabilir.');
        }
        
        return await DiscussionRepository.create(data);
    }

    async getAllDiscussions(filters) {
        return await DiscussionRepository.findAll(filters);
    }

    async getDiscussionDetails(id) {
        const discussion = await DiscussionRepository.findById(id);
        if (!discussion) {
            throw new Error('Tartışma bulunamadı');
        }

        return discussion;
    }

    async deleteDiscussion(id, userId, userRole) {
        const discussion = await DiscussionRepository.findById(id);
        
        if (!discussion) {
            throw new Error('Tartışma bulunamadı');
        }

        // Sadece sahibi veya admin silebilir
        if (discussion.authorId !== userId && userRole !== 'admin') {
            throw new Error('Bu tartışmayı silme yetkiniz yok');
        }

        return await DiscussionRepository.delete(id);
    }

    async voteDiscussion(id, userId, value) {
        // Tartışma var mı kontrol et
        const discussion = await DiscussionRepository.findById(id);
        if (!discussion) {
            throw new Error('Tartışma bulunamadı');
        }

        // Değer kontrolü (1 veya -1 olmalı)
        if (value !== 1 && value !== -1) {
            throw new Error('Geçersiz oy değeri');
        }

        // Repository'den oy ver
        const vote = await VoteRepository.voteDiscussion(id, userId, value);

        // Bildirim Gönder (Tartışma sahibine, eğer upvote ise)
        if (value === 1 && vote.id) {
            try {
                await NotificationService.createNotification({
                    userId: discussion.authorId,
                    senderId: userId,
                    type: 'VOTE',
                    message: `"${discussion.title}" konulu tartışmanız beğenildi.`,
                    targetId: id
                });
            } catch (err) {
                console.error('Bildirim gönderilemedi:', err.message);
            }
        }

        return vote;
    }

    async getTrending() {
        return await DiscussionRepository.findTrending();
    }

    async getFollowingFeed(userId) {
        return await DiscussionRepository.findFollowingFeed(userId);
    }
}



const discussionService = new DiscussionService();
export default discussionService;
