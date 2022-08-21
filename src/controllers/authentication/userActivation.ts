import User from '../../models/user';
import { Request, Response, NextFunction } from 'express';
import { AnyARecord } from 'dns';

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //check mongodb for token for this specific user
        const user = await User.findOne({ emailToken: req.query.token });

        if (!user)
            return res.status(400).json({ message: 'Failed to Verify Email.' });

        //replace these values to show that a user is verified
        user.emailToken = 'null';
        user.isVerified = true;

        await user.save();

        res.status(200).json({ message: 'Email Successfully Verified!' });
    } catch (err: any) {
        next(err);
    }
};
