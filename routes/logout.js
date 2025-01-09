import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    const user = res.locals.user;
    user.authToken = undefined;
    user.refreshToken = undefined;
    user.save();

    res.cookie('refresh_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 60 * 60 * 24 * 14
    });

    res.status(200).send();
});

export default router