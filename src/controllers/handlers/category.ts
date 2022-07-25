import Category from '../../models/category';
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
            message: 'New Category created!',
            data: newcategory,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //get specific category id
        const id = req.params.categoryId;

        const category = await Category.findOne({ _id: id });

        //return not found
        if (!category) {
            return res.status(404).json({
                error: 'Not Found',
                msg: 'Category not found',
            });
        } else {
            //delete category if it exists
            const deleteCategory = await Category.deleteOne({ _id: id });

            res.status(201).json({
                message: 'Successfully Deleted',
                data: category,
            });
        }
    } catch (err) {
        next(err);
    }
};

export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await Category.find({});
        res.json({
            data: categories,
        });
    } catch (err) {
        next(err);
    }
};

export const editCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //validate updated user input
    const newCategory = await categorySchema.validateAsync(req.body);
    //find document and update with newCategory
    const category = await Category.findByIdAndUpdate(
        req.params.categoryId,
        newCategory,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        data: category,
        msg: 'Category Successfully updated',
    });

    if (!category)
        return res.status(404).json({
            error: 'Not Found',
            message: 'Category not found!',
        });
};
