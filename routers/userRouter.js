import express from 'express';
import {
    signup,
    protect,
    logout,
    login,
} from '../controller/authController.js';
import {
    getMe
} from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.use(protect);
router.get('/', getMe);

export default router;
