import mongoose, { Schema } from 'mongoose';

export interface News {
    author: string;
    title: string;
    content: string;
    url: string;
    newsImage: string;
}

const newsSchema: Schema = new Schema({
    author: {
        type: String,
        index: true,
    },
    title: {
        type: String,
        index: true,
    },
    content: {
        type: String,
        index: true,
    },
    url: String,
    newsImage: {
        type: String,
        index: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    addToSlider: {
        type: Boolean,
        default: false,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            comment: String,
        },
    ],
    addedAt: {
        type: Date,
    },
});

export default mongoose.model<News>('News', newsSchema);
