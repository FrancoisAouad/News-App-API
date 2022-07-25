import User from '../../models/user';
import { Response, Request, NextFunction } from 'express';
import atob from 'atob';

//access function that protects route from unverified users
export const isAdmin = async (
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
            //give access if user is admin is valid
        } else {
            if (user.admin === false) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: 'Access Not Allowed.',
                });
            } else if (user.admin === true) {
                next();
            }
        }
    } catch (err) {
        next(err);
    }
};
