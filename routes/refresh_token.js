import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../schemas/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err)
            return res.status(401).send();

        const uid = payload.uid;
        const user = await User.findById(uid);
        
        if (user === null)
            return res.status(410).send();

        const authToken = jwt.sign(
            {
                uid: uid,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const newRefreshToken = jwt.sign(
            {
                uid: uid,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "14d" }
        );

        user.authToken = authToken;
        user.refreshToken = newRefreshToken;
        user.save();

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: '.jjarkulisch.github.io',
            path: '/refresh_token',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({
            username: user.username,
            authToken: authToken
        });
    });
});

export default router