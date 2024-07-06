import dotenv from 'dotenv';
dotenv.config({path: './config.env'});
import mongoose from 'mongoose';

import app from './src/app';

const port = process.env.PORT || 3000;

const connectToDB = async () => {
	await mongoose.connect('mongodb://ticketing-mongo-srv:27017/ticketing');
	console.log("Connected to mongoDB...");
};

// TODO check if this is the right place for the err
if (!process.env.JWT_SECRET) {
	throw new Error("JWT secret must be defined.")
}

connectToDB();


app.listen(port, () => {
	console.log(`Server is running on port ${port}...`);
})