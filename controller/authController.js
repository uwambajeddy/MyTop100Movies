import jsonwebtoken from 'jsonwebtoken';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import userModel from '../model/user.js';

const { sign, verify } = jsonwebtoken;

const signToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

export const signup = catchAsync(async (req, res) => {

    const newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password_confirm: req.body.password_confirm,
    });
    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!password || !email) return next(new AppError('Please fill empty fields!', 400));

    const user = await userModel
        .findOne({ email })
        .select('+password')
        .select('+active');

    if (!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError('Wrong email or password!', 401));

    createSendToken(user, 200, res);
});

export function logout(req, res) {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success', data: null });
}

export const protect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token || token === 'loggedout') return next(new AppError('You are not logged in! please login to get access', 401));
    const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

    const currentUser = await userModel.findById(decoded.id);

    if (!currentUser) return next(new AppError('The user belonging to this token does no longer exist', 401));


    req.user = currentUser;
    next();
});

