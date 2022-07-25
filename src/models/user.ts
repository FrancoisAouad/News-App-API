import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
// import { APIError } from '../../utils/errorHandlers/classes/apiError';

// const Schema = mongoose.Schema;
//user interface
export interface User {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    emailToken: string;
    isVerified: boolean;
    admin: boolean;
}
//usermethods document
export interface UserMethods extends User, Document {
    isVerified: boolean;
    isValidPassword(password: string): Promise<any>;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    admin: {
        type: Boolean,
        default: false,
    },
});

UserSchema.pre('save', async function (next) {
    try {
        //  add hashed password into database
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error: any) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function (password: any) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw new Error('New Error');
    }
};
export default mongoose.model<UserMethods>('User', UserSchema);
