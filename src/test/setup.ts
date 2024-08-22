import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(30000); // Set timeout to 30 seconds
jest.mock('../natsWrapper')

let mongo: any;

beforeAll(async () => {
	jest.clearAllMocks();
	process.env.JWT_SECRET = 'false secret';
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	if (mongoose.connection.db) {
		const collections = await mongoose.connection.db.collections();
	
		for (const collection of collections) {
			await collection.deleteMany();
		}
	} else {
		console.warn('Database connection not established');
	}
});

afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
})
