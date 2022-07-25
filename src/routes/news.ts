import express from 'express';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT';
import { getHome } from '../controllers/home';
import { isEmailVerified } from '../middleware/secure/isUserVerified';
import { getAllCategories } from '../controllers/handlers/category';
import {
    getAllNews,
    getNewsById,
    getSliderNews,
    getNewsByCategory,
} from '../controllers/handlers/news';

const router = express.Router();

//home menu
router.get('/', verifyAccessToken, isEmailVerified, getHome);

//fetch all categories
router.get(
    '/get-Categories',
    verifyAccessToken,
    isEmailVerified,
    getAllCategories
);

router.get(
    '/get-AllNews/:pageNo/:pageSize',
    verifyAccessToken,
    isEmailVerified,
    getAllNews
);
router.get(
    '/get-ById/:newsId',
    verifyAccessToken,
    isEmailVerified,
    getNewsById
);
router.get(
    '/get-AllNews/slider',
    verifyAccessToken,
    isEmailVerified,
    getSliderNews
);
router.get(
    '/get-ByCategory/:categoryId',
    verifyAccessToken,
    isEmailVerified,
    getNewsByCategory
);

export default router;
