import express from 'express';
import Game from '../schemas/Game.js';

const router = express.Router();

router.put('/', async (req, res) => { // new saves and ascenscion
    try {
        const uid = res.locals.user._id.toString();
        req.body.uid = uid;
        const game = await Game.findOneAndReplace({uid: uid}, req.body, {upsert: true});
        
        if (game === null)
            return res.status(201).send();

        return res.status(204).send();
    }
    catch (e) {
        console.log(e);
        return res.status(400).send(e.message);
    }
});

router.patch('/', async (req, res) => { // update existing save
    try {
        const uid = res.locals.user._id.toString();
        const game = await Game.findOneAndUpdate({uid: uid}, req.body );
        game.save();
        
        return res.status(204).send();
    }
    catch (e) {
        return res.status(400).send(e.message);
    }
});

export default router