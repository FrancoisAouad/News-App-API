import News from '../../models/news';
import { Request, Response, NextFunction } from 'express';

////
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
//aggregation
export const getNewsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news: any = await News.findOne({ _id: req.params.newsId });
        if (!news)
            return res.status(404).json({
                success: false,
                error: 'NotFound',
                message: 'no such news found..',
            });
        news.views += 1;
        await news.save();
        const result = await News.aggregate([
            {
                $match: {
                    _id: req.params.newsId,
                },
            },
            //lookup users to comments
        ]);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};
//aggregation group b ycategory id and push notes to array
export const getNewsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await News.find({
            category: req.params.categoryId,
        }).populate({
            path: 'category',
            select: ['_id', 'categoryName'],
        });

        res.json({
            success: true,
            count: news.length,
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
