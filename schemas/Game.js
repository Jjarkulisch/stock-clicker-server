import mongoose from 'mongoose';
import db from '../mongo.js';

const Savefile = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    place: {
        type: String,
        default: 'garden'
    },
    money: {
        type: Number,
        default: 0
    },
    units: {
        type: Array,
        default: []
    },
    unlockedPlaces: {
        type: Array,
        default: []
    },
    ascenscions: {
        type: Number,
        default: 0
    },
    ascending: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now()
    },
    isAFK: {
        type: Boolean,
        default: false
    }
});

export default db.model('Savefile', Savefile);