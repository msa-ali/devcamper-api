const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log(`Connected to MongoDB Database : ${conn.connection.host}`.cyan.underline.bold);
    } catch (err) {
        console.log('Unable to connect to database'.red.bold);
        throw err;
    }
};

module.exports = connectDB;