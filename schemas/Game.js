import mongoose from 'mongoose';
import db from '../mongo.js';

import unitSchema from './Unit.js';

const savefileSchema = new mongoose.Schema({
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
    units: [unitSchema],
    unlockedPlaces: {
        type: Array,
        default: ['garden']
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

export default db.model('Savefile', savefileSchema);