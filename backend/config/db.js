const mongoose = require('mongoose');

const connectDB = async () => {
    console.log("Starting Mongoose connection!");
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfully connected to MongoDB on: ${conn.connection.host}`);
    }
    catch (e) {
        console.log(`MongoDB Error: ${e}`);
        process.exit(1);
    }
}

module.exports = connectDB;