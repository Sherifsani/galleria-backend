const mongoose = require('mongoose')

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connected successfully!");
    } catch (error) {
        console.log("Error connecting to the database: ", error);
        process.exit(1);
    }
}

module.exports = connectToDb