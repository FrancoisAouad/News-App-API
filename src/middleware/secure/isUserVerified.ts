import User from '../../models/user';
import { Response, Request, NextFunction } from 'express';
import atob from 'atob';

//access function that protects route from unverified users
export const isEmailVerified = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //get access token from headers
        const authHeader = req.headers['authorization'];

        //decoded token and parse it using atob
        const payload = JSON.parse(atob(authHeader!.split('.')[1]));
        //check payload for userID

        const id = payload.aud;
        //check if user exists
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(400).json({
                error: 'Unauthorized',
                message: 'Invalid Email/Password',
            });
            //give access if token is valid
        } else {
            if (user.isVerified === false) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Please verify your email',
                });
            } else if (user.isVerified === true) {
                next();
            }
        }
    } catch (err) {
        next(err);
    }
};
