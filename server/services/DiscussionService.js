import DiscussionRepository from '../repositories/DiscussionRepository.js';
import VoteRepository from '../repositories/VoteRepository.js';

class DiscussionService {
    async createNewDiscussion(data) {
        if (data.title.length < 5) {
            throw new Error('Başlık en az 5 karakter olmalıdır');
        }
        
        return await DiscussionRepository.create(data);
    }

    async getAllDiscussions() {
        return await DiscussionRepository.findAll();
    }

    async getDiscussionDetails(id) {
        const discussion = await DiscussionRepository.findById(id);
        if (!discussion) {
            throw new Error('Tartışma bulunamadı');
        }

        // Toplam oy sayısını hesapla
        const upvotes = discussion.votes.filter(v => v.value === 1).length;
        const downvotes = discussion.votes.filter(v => v.value === -1).length;
        discussion.voteScore = upvotes - downvotes;

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
        return await VoteRepository.voteDiscussion(id, userId, value);
    }
}



const discussionService = new DiscussionService();
export default discussionService;
