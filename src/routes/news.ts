import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT';
import { getHome } from '../controllers/handlers/user';
import { isEmailVerified } from '../middleware/secure/isUserVerified';
import { getAllCategories } from '../controllers/handlers/category';
import { getNewsById, getNewsByCategory } from '../controllers/handlers/news';

const router = express.Router();

//home menu
router.get('/', verifyAccessToken, isEmailVerified, getHome);
//fetch all categories
router.get('/categories', verifyAccessToken, isEmailVerified, getAllCategories);
//get all notes
router.get('/:newsId', verifyAccessToken, isEmailVerified, getNewsById);
router.get(
    '/bycategory/:categoryId',
    verifyAccessToken,
    isEmailVerified,
    getNewsByCategory
);

export default router;
