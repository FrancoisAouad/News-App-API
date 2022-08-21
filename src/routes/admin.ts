import express from 'express';
import {
    addCategory,
    deleteCategory,
    editCategory,
} from '../controllers/handlers/category';
import { isAdmin } from '../middleware/secure/isAdmin';
import { verifyAccessToken } from '../controllers/jwt/verifyJWT';
import {
    addNews,
    deleteNewsById,
    editNews,
} from '../controllers/handlers/news';
const categoryPath = 'category';
const newsPath = 'news';
const router = express.Router();
//create categories
router.post(`${categoryPath}`, verifyAccessToken, addCategory);
//delete categories
router.delete(
    `${categoryPath}/:categoryId`,
    verifyAccessToken,
    isAdmin,
    deleteCategory
);

//edit and update categories
router.put(
    `${categoryPath}/:categoryId`,
    verifyAccessToken,
    isAdmin,
    editCategory
);

router.post(`${newsPath}`, verifyAccessToken, isAdmin, addNews);

router.delete(
    `${newsPath}/:newsId`,
    verifyAccessToken,
    isAdmin,
    deleteNewsById
);
router.put(`${newsPath}/:newsId`, verifyAccessToken, isAdmin, editNews);

export default router;
