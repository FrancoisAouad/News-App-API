import User from '../../models/user';
import { resetPassSchema } from '../../middleware/validation/userValidation';
import { setResetPasswordToken } from '../jwt/configJWT';
import { verifyResetPasswordToken } from '../jwt/verifyJWT';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer';
import atob from 'atob';
//SEND FORGOT PASSWORD EMAIL
//
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers['authorization'];

        //decoded token and parse it using atob
        const payload = JSON.parse(atob(authHeader!.split('.')[1]));
        //check payload for userID
        const id = payload.aud;
        //check if user exists
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'Account not found',
            });
        } else {
            const passwordToken = await setResetPasswordToken(user.id);
            nodemailer({
                from: process.env.NODEMAILER_USER,
                to: user.email,
                subject: 'Reset Password',
                html: `<h2> Dear, ${user.name}</h2>
        <br/>
            <p>Your reset password link is available below.</p>
            <br/>
            <a href="http://${req.headers.host}/api/v1/auth/reset-password/${user.id}/${passwordToken}">Reset</a>`,
            });
            res.status(200).json({
                success: true,
                message: 'Reset password link has been to your email!',
            });
        }
    } catch (err) {
        next(err);
    }
};

//RESET PASSWORD
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, token } = req.params;
        //getUserID
        const result = await resetPassSchema.validateAsync(req.body);

        const user = await User.findOne({ _id: id });
        if (user) {
            //verify that the password token is valid
            await verifyResetPasswordToken(token);
            //salt and hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(result.password, salt);
            user.password = hashedPassword;
            //update password in database
            await user.save();

            res.status(201).json({ message: 'Password Successfully Updated.' });
        }
    } catch (error: any) {
        next(error);
    }
};
