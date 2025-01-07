import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/User.js';


const router = express.Router();

router.post('/', async (req, res) => {
    const credentials = req.body;
    const userExists = await User.exists({ username: credentials.username });

    if (userExists)
        return res.status(409).send("User already exists");

    bcrypt.genSalt(11, (err, salt) => {
        bcrypt.hash(credentials.password, salt, async (err, hash) => {
            await User.create({ username: credentials.username, password: hash });
            const user = await User.findOne({ username: credentials.username });
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

            return res.status(201).json({
                username: user.username,
                authToken: authToken
            });
        });
    });
});

export default router