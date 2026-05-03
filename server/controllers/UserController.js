import UserRepository from '../repositories/UserRepository.js';
import ApiError from '../utils/ApiError.js';

class UserController {
    /**
     * @desc    Giriş yapmış kullanıcının profilini getir
     * @route   GET /api/v1/users/me
     * @access  Private
     */
    async getMe(req, res, next) {
        try {
            const userId = req.user.id;
            const profile = await UserRepository.findProfile(userId);

            if (!profile) {
                return next(new ApiError(404, 'Kullanıcı profili bulunamadı'));
            }

            res.json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Herhangi bir kullanıcının profilini getir
     * @route   GET /api/v1/users/:id
     * @access  Private
     */
    async getUserProfile(req, res, next) {
        try {
            const { id } = req.params;
            const profile = await UserRepository.findProfile(id);

            if (!profile) {
                return next(new ApiError(404, 'Kullanıcı bulunamadı'));
            }

            res.json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Kullanıcı profilini güncelle (fullName vb.)
     * @route   PATCH /api/v1/users/me
     * @access  Private
     */
    async updateMe(req, res, next) {
        try {
            const userId = req.user.id;
            const { fullName } = req.body;

            const updatedUser = await UserRepository.update(userId, { fullName });

            res.json({
                success: true,
                data: updatedUser
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Kullanıcıyı takip et
     * @route   POST /api/v1/users/:id/follow
     */
    async followUser(req, res, next) {
        try {
            const followerId = req.user.id;
            const followingId = req.params.id;

            if (followerId === followingId) {
                throw new ApiError(400, 'Kendinizi takip edemezsiniz');
            }

            await UserRepository.followUser(followerId, followingId);

            res.json({
                success: true,
                message: 'Kullanıcı takip edildi'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Takibi bırak
     * @route   DELETE /api/v1/users/:id/follow
     */
    async unfollowUser(req, res, next) {
        try {
            const followerId = req.user.id;
            const followingId = req.params.id;

            await UserRepository.unfollowUser(followerId, followingId);

            res.json({
                success: true,
                message: 'Takip bırakıldı'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Önerilen kullanıcıları getir (En çok takip edilenler)
     */
    async getSuggestedUsers(req, res, next) {
        try {
            const users = await UserRepository.findSuggestedUsers(req.user.id);

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController();
export default userController;
