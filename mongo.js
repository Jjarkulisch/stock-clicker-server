import mongoose from 'mongoose';

const connection = mongoose.createConnection(process.env.DB_URI);

export default connection