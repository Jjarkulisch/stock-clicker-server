import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    const user = res.locals.user;
    user.authToken = undefined;
    user.refreshToken = undefined;
    user.save();

    res.cookie('refresh_token', '', {
        httpOnly: true,
        sameSite: 'Strict'
    });

    res.status(200).send();
});

export default router