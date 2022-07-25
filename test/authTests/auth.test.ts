// const { login, register } = require('../../controllers/authentication/auth.js');

// require('../../config/redisCon.js');
// const User = require('../../models/user.js');
// const mongoose = require('mongoose');

// mongoose
//     .connect(process.env.MONGODB_URI, {
//         dbName: process.env.DB_NAME,
//     })
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((err) => console.log(err.message));

// it('New user should be registered in database', (done) => {
//     const res = request.post('/v1/auth/register').send({
//         name: 'test test',
//         email: 'grigoryan1999227@gmailwe.com',
//         password: '1234567',
//         confirmPassword: '1234567',
//     });
//     const user = User.findOne({
//         email: 'grigoryan1999227@gmailwe.com',
//     });

//     expect(user.name).toBeTruthy();
//     expect(user.email).toBeTruthy();
//     expect(user.emailToken).toString();
//     expect(user.isVerified);
//     done();

//     afterAll((done) => {
//         mongoose.connection.close();
//         done();
//     });
// });
