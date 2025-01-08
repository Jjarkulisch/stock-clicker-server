import mongoose from 'mongoose';

import upgradeSchema from './Upgrade.js';

const unitSchema = new mongoose.Schema({
    name: String,
    description: String,
    rps: Number,
    price: Number,
    basePrice: Number,
    count: Number,
    upgradeStage: Number,
    upgrades: [upgradeSchema]

});

export default unitSchema;