import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schemas/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const credentials = req.body;

    const user = await User.findOne({ username: credentials.username });

    if (user === null)
        return res.status(400).send('Invalid credentials');

    bcrypt.compare(credentials.password, user.password, (err, match) => {
        if (err) {
            console.log('gg')
        }
        if (match) {
            const uid = user._id.toString();

            const authToken = jwt.sign(
                {
                    uid: uid,
                    username: user.username
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            const refreshToken = jwt.sign(
                {
                    uid: uid,
                    username: user.username
                },
                process.env.JWT_SECRET,
                { expiresIn: "14d" }
            );

            user.authToken = authToken;
            user.refreshToken = refreshToken;
            user.save();

            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict'
            });

            return res.status(200).json({
                username: user.username,
                authToken: authToken
            });
        } else {
            return res.status(400).send('Invalid credentials');
        }
    });
});

export default router