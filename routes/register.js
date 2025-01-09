import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/User.js';


const router = express.Router();

router.post('/', async (req, res) => {
    const authHeader = req.header('Authorization');

    if (authHeader === undefined)
        return res.status(401).send();

    const credentials = atob(authHeader.split(' ')[1]).split(':');
    const username = credentials[0];
    const password = credentials[1];

    const userExists = await User.exists({ username: username });

    if (userExists)
        return res.status(409).send("User already exists");

    bcrypt.genSalt(11, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            await User.create({ username: username, password: hash });
            const user = await User.findOne({ username: username });
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
                secure: true,
                sameSite: 'Strict',
                maxAge: 60 * 60 * 24 * 14
            });

            return res.status(201).json({
                username: user.username,
                authToken: authToken
            });
        });
    });
});

export default router