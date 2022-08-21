import crypto from 'crypto';

const accessTokenSecret: string = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret: string = crypto.randomBytes(32).toString('hex');
const resetPasswordTokenSecret: string = crypto.randomBytes(32).toString('hex');
console.table({
    accessTokenSecret,
    refreshTokenSecret,
    resetPasswordTokenSecret,
});
