import crypto from 'crypto';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import nodemailer from '../../utils/nodemailer';
import client from '../../config/redisCon';
import { verifyRefreshToken } from '../jwt/verifyJWT';
import {
    loginSchema,
    signupSchema,
} from '../../middleware/validation/userValidation';
import { setAccessToken, setRefreshToken } from '../jwt/configJWT';

//REGISTER
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //validate user input
        const result = await signupSchema.validateAsync(req.body);
        //genarate encrypted email token to be used for account activation
        const newToken = crypto.randomBytes(64).toString('hex');
        //check if email already exists in database
        const exists = await User.findOne({ email: result.email });
        if (exists)
            throw createError.Conflict(
                `${result.email} has already been registered`
            );

        const user = new User(result);

        //add token to db
        user.emailToken = newToken;
        const savedUser = await user.save();
        //generate access and refresh token by saving calling the methods and saving in variables
        const accessToken = await setAccessToken(savedUser.id);
        const refreshToken = await setRefreshToken(savedUser.id);
        //send jwt tokens to client
        res.send({ accessToken, refreshToken });

        //ACTIVATION EMAIL TEMPLATE
        console.log(user.email);
        nodemailer({
            from: process.env.NODEMAILER_USER,
            to: result.email,
            subject: 'Email Verification',
            html: `<h2> Welcome, ${result.name}!</h2>
      <br/>
          <p>Thank you for registering, you are almost done. Please read the below message to continue.</p>
          <br/>
         <p>In order to confirm your email, kindly click the verification link below.</p>
          <br/>
        <a href="http://${req.headers.host}/api/v1/auth/verify-email?token=${user.emailToken}">Click here to verify</a>`,
        });
        console.log('reg email was sent');
    } catch (error: any) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};

//LOGIN
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await loginSchema.validateAsync(req.body);
        //check if email exists
        const user = await User.findOne({ email: result.email });
        if (!user)
            return res
                .status(404)
                .json({ error: 'Not Found', message: 'User Not found' });
        //calls the isvalidpassword method in user model which compares the hashed password and inputed pass
        const isMatch = await user.isValidPassword(result.password);

        if (isMatch === false)
            // throw new createError.Unauthorized('Invalid 0000');
            return res.status(400).json({
                error: 'Unauthorized',
                message: 'Invalid Email/Password',
            });
        //generate access and refresh token by saving calling the methods and saving in variables
        const accessToken = await setAccessToken(user.id);
        const refreshToken = await setRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    } catch (error: any) {
        if (error.isJoi === true)
            return createError(400, 'Invalid username/password');
    }
};

//REFRESH TOKEN
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.body;
        //throw error if refresh token isnt found
        if (!refreshToken) throw createError.BadRequest();
        //else verify the current token
        const userId = await verifyRefreshToken(refreshToken);
        //if it passes then generate new tokens and send them to the user again
        const accessToken = await setAccessToken(userId);
        const refToken = await setRefreshToken(userId);

        res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error: any) {
        next(error);
    }
};

//LOGOUT
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //check refresh token
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);
        //delete refresh token to logout
        client.DEL(userId, (err: any, val: any) => {
            if (err) {
                console.log(err.message);
                throw new createError.InternalServerError();
            }
            console.log(val);
            res.sendStatus(204);
        });
        // console.log(`${email} logged out`);
    } catch (error: any) {
        next(error);
    }
};
