const mongoose = require('mongoose');

const Connect = async (username = 'bedresujal43', password = '0J9YK39JHWMRvTnk') => {
    const URI = `mongodb+srv://${username}:${password}@cluster0.vuixl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    const URL = `mongodb://localhost:27017/just`

    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            maxPoolSize: 50
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log(`Error while connecting with the database: ${error}`);
        throw error;
    }
};

module.exports = Connect;
