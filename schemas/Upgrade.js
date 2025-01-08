import mongoose from 'mongoose';

const upgradeSchema = new mongoose.Schema({
    name: String,
    description: String,
    rps: Number,
    price: Number,
    prereq: Number
});

export default upgradeSchema;