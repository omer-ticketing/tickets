import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@omer-ticketing/common";
import { OrderCreatedListener } from "../orderCreatedListener";
import Ticket from "../../../models/ticketModel";
import { Message } from "node-nats-streaming";
import { ObjectId } from 'mongodb';
import natsWrapper from "../../../natsWrapper";
import { OrderCancelledLIstener } from "../orderCancelledListener";

export const orderCreatedSetup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = await Ticket.build({ title: "A ticket", price: 3, userId: "sfdsdf" });
    const data: OrderCreatedEvent["data"] = {
		id: new ObjectId().toString(),
		expiresAt: new Date().toISOString(),
		status: OrderStatus.Created,
		userId: 'fs32',
		version: 0,
		ticket: {
			id: ticket.id,
			price: ticket.price
		}
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, ticket, data, msg };
};

export const orderCancelledSetup = async () => {
    const listener = new OrderCancelledLIstener(natsWrapper.client);
    const ticket = await Ticket.build({ title: "A ticket", price: 3, userId: "sfdsdf" });
	const orderId = new ObjectId().toString();
	ticket.set({ orderId })
	await ticket.save();
	
    const data: OrderCancelledEvent["data"] = {
		id: orderId,
		ticketId: ticket.id,
		version: 0	
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn()
	}

	return { listener, ticket, data, msg };
};
