import News from '../../models/news';
import { Request, Response, NextFunction } from 'express';
// import { categorySchema } from '../../middleware/validation/categoryValidation';
import base64 from 'crypto-js/enc-base64';
import ImageToBase64 from 'image-to-base64';

export const addNews = async (req, res: Response, next: NextFunction) => {
    try {
        console.log(req.files);
        const { title, content, author, category, addToSlider } = req.body;

        const base64Data = await ImageToBase64(req.files.newsImage.path);
        // console.log("base64Data ", base64Data);

        const news = await News.create({
            title,
            author,
            content,
            category,
            addToSlider,
            newsImage: `data:${req.files.newsImage.type};base64,${base64Data}`,
            addedAt: Date.now(),
        });

        if (news) {
            res.status(201).json({
                success: true,
                message: 'Successfully Added News',
                data: news,
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: 'Invalid News Data',
            });
        }
    } catch (error) {
        next(error);

        // res.status(500).json({
        //     success: false,
        //     msg: 'Internal error occured.',
        //     data: new_category,
        // });
    }
};

export const getAllNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const size: any = req.params.pageSize;
        const pageNo: any = req.params.pageNo;

        var query = {
            skip: 0,
            limit: 0,
        };

        if (pageNo < 0 || pageNo === 0) {
            return res.status(401).json({
                success: false,
                msg: 'Invalid page number, should start with 1',
            });
        }

        query.skip = size * (pageNo - 1);
        query.limit = size;

        const newsCount = await News.find({});

        const news = await News.find({})
            .sort('-addedAt')
            .populate({ path: 'category', select: ['_id', 'categoryName'] })
            .limit(Number(query.limit))
            .skip(Number(query.skip));

        res.json({
            success: true,
            count: newsCount.length,
            data: news,
        });
    } catch (error) {
        next(error);
    }
};

export const getNewsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await News.findById(req.params.newsId).populate({
            path: 'category',
            select: ['_id', 'categoryname'],
        });

        res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        next(error);
    }
};

export const getSliderNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await News.find({ addToSlider: true }).populate({
            path: 'category',
            select: ['_id', 'categoryName'],
        });

        res.json({
            success: true,
            count: news.length,
            data: news,
        });
    } catch (error) {
        next(error);
    }
};

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
    } catch (error) {
        next(error);
    }
};

export const deleteNewsById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await News.findByIdAndDelete(req.params.newsId);

        res.status(201).json({
            success: true,
            msg: 'Successfully Deleted',
            data: news,
        });

        if (!news) {
            return res.status(401).json({
                success: false,
                msg: 'News not found',
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc Update News
export const editNews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const news = await News.findByIdAndUpdate(req.params.newsId, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).json({
            success: true,
            msg: 'Successfully Updated',
            data: news,
        });

        if (!news) {
            return res.status(401).json({
                success: false,
                msg: 'News not found',
            });
        }
    } catch (error) {
        next(error);
    }
};
