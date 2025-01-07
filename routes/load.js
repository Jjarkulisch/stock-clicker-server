import express from 'express';
import Game from '../schemas/Game.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const uid = res.locals.user._id.toString();
        const game = await Game.findOne({ uid: uid });
        
        return res.status(200).json(game);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
});

export default router