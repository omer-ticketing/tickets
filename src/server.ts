import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import app from "./app";
import natsWrapper from "./natsWrapper";
import { ifNotExistThrowErr } from "./utils/helpers";
import { OrderCreatedListener } from "./events/listeners/orderCreatedListener";
import { OrderCancelledLIstener } from "./events/listeners/orderCancelledListener";

const port = process.env.PORT || 3000;

const initNATSListeners = () => {
	new OrderCreatedListener(natsWrapper.client).listen();
	new OrderCancelledLIstener(natsWrapper.client).listen();
};

const init = async () => {
    ifNotExistThrowErr(process.env.JWT_SECRET, "JWT secret");
    ifNotExistThrowErr(process.env.MONGO_URI, "Mongo URI");
    ifNotExistThrowErr(process.env.NATS_CLIENT_ID, "Nats client Id");
    ifNotExistThrowErr(process.env.NATS_URL, "NATS URL");
    ifNotExistThrowErr(process.env.NATS_CLUSTER_ID, "NATS cluster Id");

    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
    natsWrapper.client.on("close", () => {
		console.log("Nats connection closed.");
        process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
	initNATSListeners();

    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to mongoDB...");
};

init();

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
