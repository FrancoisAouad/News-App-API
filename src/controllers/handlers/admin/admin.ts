import { Request, Response, NextFunction } from 'express';
import Category from '../../../models/category';
import News from '../../../models/news';
import { categorySchema } from '../../../middleware/validation/categoryValidation';

export const editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //validate updated user input
        const newCategory = await categorySchema.validateAsync(req.body);
        //find document and update with newCategory
        const editedCategory = await Category.updateOne({
            categoryName: newCategory,
        });
        if (!editedCategory)
            return res.status(404).json({
                error: 'NotFound',
                message: 'No such category found..',
            });

        res.status(200).json({
            success: true,
            message: 'Category Successfully updated',
        });
    } catch (error: any) {
        next(error);
    }
};
export const addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //validate input
        const { categoryName } = await categorySchema.validateAsync(req.body);

        const category = await Category.findOne({ categoryName: categoryName });
        if (category) {
            return res.status(401).json({
                error: 'Bad Request',
                message: 'Category already exists.',
            });
        }
        //create new category document
        const categ = new Category({ categoryName });
        //save in collection
        const newcategory = await categ.save();

        res.status(201).json({
            success: true,
            message: 'New Category created!',
            data: newcategory,
        });
    } catch (err: any) {
        next(err);
    }
};
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const exists = await Category.findOne({ _id: req.params.categoryId });
        if (!exists)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'no such category exists..',
            });
        const noteExists = await News.find({
            categoryID: req.params.categoryId,
        });
        if (noteExists.length > 0) {
            await News.deleteMany({ categoryID: req.params.categoryId });
            await Category.deleteOne({
                _id: req.params.categoryId,
            });

            res.status(200).json({
                success: true,
                message:
                    'category and all mesage associated have been deleted.',
            });
        } else {
            await Category.deleteOne({
                _id: req.params.categoryId,
            });
            res.status(200).json({
                success: true,
                message: 'Successfully Deleted category',
            });
        }
    } catch (err) {
        next(err);
    }
};
//---------------NEWS--------------//
export const addNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, content, author, category } = req.body;

        const news = await News.create({
            title: title,
            author: author,
            content: content,
            category: category,
        });

        res.status(201).json({
            success: true,
            message: 'News successfully added!',
            data: news,
        });
    } catch (error: any) {
        next(error);
    }
};
export const deleteNewsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deletedNews = await News.deleteOne({ _id: req.params.newsId });
        if (!deletedNews)
            return res.status(401).json({
                success: false,
                message: 'News not found..',
            });

        res.status(201).json({
            success: true,
            message: 'Successfully Deleted!',
        });
    } catch (error: any) {
        next(error);
    }
};
export const editNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, content, author } = req.body;
        const news = await News.updateOne(
            { _id: req.params.newsId },
            { title: title, content: content, author: author }
        );
        if (!news)
            return res.status(401).json({
                success: false,
                message: 'News not found',
            });

        res.status(201).json({
            success: true,
            message: 'Successfully Updated',
            data: news,
        });
    } catch (error: any) {
        next(error);
    }
};
