import mongoose from 'mongoose';
import db from '../mongo.js';

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authToken: String,
    refreshToken: String
});

export default db.model('User', User);