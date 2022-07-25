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

const router = express.Router();
//create categories
router.post('/add-Category', verifyAccessToken, addCategory);
//delete categories
router.delete(
    '/delete-Category/:categoryId',
    verifyAccessToken,
    isAdmin,
    deleteCategory
);

// router.get('/getCategories', getAllCategories);
//edit and update categories
router.put(
    '/edit-Category/:categoryId',
    verifyAccessToken,
    isAdmin,
    editCategory
);

// router.route('/post/image/fb').post(imageUpload)
router.post('/add-News', verifyAccessToken, isAdmin, addNews);
// router.get('/getAllNews/:pageNo/:pageSize',getAllNews);
// router.get('/getById/:newsId',getNewsById);
// router.get('/getAllNews/slider',getSliderNews);
// router.get('/getByCategory/:catId',getNewsByCategory);

router.delete(
    '/delete-News/:newsId',
    verifyAccessToken,
    isAdmin,
    deleteNewsById
);
router.put('/edit-News/:newsId', verifyAccessToken, isAdmin, editNews);

export default router;
