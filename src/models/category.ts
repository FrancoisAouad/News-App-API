import mongoose, { Schema } from 'mongoose';

export interface Category {
    categoryName: string;
}

const categorySchema: Schema = new Schema({
    categoryName: {
        type: String,
        unique: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model<Category>('category', categorySchema);
