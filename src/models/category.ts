import mongoose, { Schema } from 'mongoose';

export interface Category {
    categoryName: string;
}

const categorySchema: Schema = new Schema({
    categoryName: {
        type: String,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// module.exports = mongoose.model('Category', categorySchema)
export default mongoose.model<Category>('category', categorySchema);
