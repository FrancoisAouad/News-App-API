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

router.post('/login', login);

router.post('/register', register);

router.post('/refreshtoken', verifyAccessToken, refreshToken);

router.delete('/logout', verifyAccessToken, logout);

router.get('/verifyemail', verifyEmail);

router.post(
    '/forgotpassword',
    verifyAccessToken,
    isEmailVerified,
    forgotPassword
);

router.put('/resetpassword/:id/:token', resetPassword);

export default router;
