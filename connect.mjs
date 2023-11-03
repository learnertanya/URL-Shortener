// Import mongoose using ES module syntax
import mongoose from 'mongoose';

// Define the connectToMongoDB function
async function connectToMongoDB(url) {
    return mongoose.connect(url);
}

// Export the function using ES module syntax
export { connectToMongoDB };
