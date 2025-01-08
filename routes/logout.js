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
        domain: '.jjarkulisch.github.io',
        path: '/logout',
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).send();
});

export default router