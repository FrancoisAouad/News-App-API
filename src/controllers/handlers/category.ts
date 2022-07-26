import Category from '../../models/category';
import News from '../../models/news';
import { Request, Response, NextFunction } from 'express';
import { categorySchema } from '../../middleware/validation/categoryValidation';

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
//aggregation
export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let params: any = [
            {
                $sort: { categoryName: 1, updatedDate: -1 },
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    created: '$createdDate',
                    updated: '$updatedDate',
                },
            },
        ];

        if (req.body.search) {
            let searchObj = {
                $match: { categoryName: { $regex: /^${req.body.search}/ } },
            };
            params.push(searchObj);
        }
        const categories = await Category.aggregate(params);
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        next(err);
    }
};
export const getCategoryByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.aggregate([
            {
                $match: {
                    _id: categoryId,
                },
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    created: '$createdDate',
                    updated: '$updatedDate',
                },
            },
        ]);
        res.status(200).json({ success: true, data: category });
    } catch (e) {
        next(e);
    }
};
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
