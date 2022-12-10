import catchAsync from '../utils/catchAsync.js';
import userModel from '../model/user.js';

export const getMe = catchAsync(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});