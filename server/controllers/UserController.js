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
}

const userController = new UserController();
export default userController;
