import express from 'express';
import { verifyEmail } from '../controllers/authentication/userActivation';
import {
    login,
    register,
    logout,
    refreshToken,
} from '../controllers/authentication/auth';
import {
    forgotPassword,
    resetPassword,
} from '../controllers/authentication/resetPasssword';
import { isEmailVerified } from '../middleware/secure/isUserVerified';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT';

const router = express.Router();

router.get('/login');
router.post('/login', login);

router.get('/register');
router.post('/register', register);

router.post('/refresh-token', verifyAccessToken, refreshToken);

router.delete('/logout', verifyAccessToken, logout);

router.get('/verify-email', verifyEmail);

router.post(
    '/forgot-password',
    verifyAccessToken,
    isEmailVerified,
    forgotPassword
);

router.get('/reset-password/:id/:token');
router.put('/reset-password/:id/:token', resetPassword);

export default router;
