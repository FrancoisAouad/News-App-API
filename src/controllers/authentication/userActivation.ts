import User from '../../models/user';
import { Request, Response, NextFunction } from 'express';

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //check mongodb for token for this specific user
        const token = req.query.token;
        const user = await User.findOne({ emailToken: token });

        if (user) {
            //replace these values to show that a user is verified
            user.emailToken = 'null';
            user.isVerified = true;

            await user.save();
            //  console.log(`${user.email} have verified their email.`);
            return res
                .status(200)
                .json({ message: 'Email Successfully Verified!' });
            // redirect('/auth/login');
        } else {
            // console.log(`Failed to verify ${user.email}`);
            return res.status(400).json({ message: 'Failed to Verify Email.' });
            // redirect('/auth/register');
        }
    } catch (err) {
        next(err);
    }
};
