import DiscussionService from '../services/DiscussionService.js';

class DiscussionController {
    async createDiscussion(req, res, next) {
        try {
            const discussion = await DiscussionService.createNewDiscussion(req.body);
            res.status(201).json({
                success: true,
                data: discussion
            });
        } catch (error) {
            res.status(400);
            next(error);
        }
    }

    async getDiscussions(req, res, next) {
        try {
            const discussions = await DiscussionService.getAllDiscussions();
            res.json({
                success: true,
                count: discussions.length,
                data: discussions
            });
        } catch (error) {
            next(error);
        }
    }
}

const discussionController = new DiscussionController();
export default discussionController;
