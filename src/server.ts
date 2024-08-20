import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import app from "./app";
import natsWrapper from "./natsWrapper";

const port = process.env.PORT || 3000;

const init = async () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret must be defined.");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined.");
    }
	
	await natsWrapper.connect('ticketing', 'abc1234', 'http://nats-srv:4222');
	natsWrapper.client.on('close', () => {
		console.log('Nats connection closed.');
		process.exit();
	})
	process.on('SIGINT', () => natsWrapper.client.close());
	process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to mongoDB...");
};

init();

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
