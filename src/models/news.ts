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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },
    views: {
        type: Number,
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
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model<News>('News', newsSchema);
