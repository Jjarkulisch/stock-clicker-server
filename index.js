import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import login from './routes/login.js';
import register from './routes/register.js';
import logout from './routes/logout.js';
import refresh from './routes/refresh_token.js';
import save from './routes/save.js';
import load from './routes/load.js';

import User from './schemas/User.js';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'https://jarkulisch-jonatan-64d3f-7znvs.hosting.ssps.cajthaml.eu',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'PATCH']
}));
app.use(cookieParser());
app.use(express.json());

app.use('/login', login);
app.use('/register', register);
app.use('/refresh_token', refresh);

app.use((req, res, next) => { // Auth middleware
    const authHeader = req.header('Authorization');

    if (authHeader === undefined)
        return res.status(401).send();
    
    const authToken = authHeader.split(' ')[1];

    jwt.verify(authToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send();
        }
        
        const uid = payload.uid;
        const user = await User.findById(uid);

        if (user === null)
            return res.status(410).send();

        res.locals.user = user;

        next();
    });
});

// following routes require auth middleware
app.use('/logout', logout);
app.use('/save', save);
app.use('/load', load);

app.listen(port, () => {
    console.log('hallo');
});