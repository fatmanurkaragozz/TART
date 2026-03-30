import DiscussionRepository from '../repositories/DiscussionRepository.js';

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
        return discussion;
    }
}

const discussionService = new DiscussionService();
export default discussionService;
