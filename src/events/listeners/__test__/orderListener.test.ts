import natsWrapper from "../../../natsWrapper";
import Ticket from "../../../models/ticketModel";
import { orderCancelledSetup, orderCreatedSetup } from "./helpers";

describe("Order created", () => {
	it("Set the orderId of the ticket", async () => {
		const { data, listener, msg, ticket } = await orderCreatedSetup();	

		await listener.onMessage(data, msg);
		const updatedTicket = await Ticket.findById(ticket.id);

		expect(updatedTicket!.orderId).toEqual(data.id);
	})
	it("Acknowledges the message", async () => {
		const { data, listener, msg } = await orderCreatedSetup();		
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	})
	it("Publishes the ticket updated event", async () => {
		const { data, listener, msg } = await orderCreatedSetup();
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalled();
		const ticketData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
		expect(ticketData.orderId).toEqual(data.id);		
	})
});

describe("Order cancelled", () => {
	it("Remove the orderId of the ticket", async () => {
		const { data, listener, msg, ticket } = await orderCancelledSetup();	

		await listener.onMessage(data, msg);
		const updatedTicket = await Ticket.findById(ticket.id);

		expect(ticket.orderId).toEqual(data.id);
		expect(updatedTicket!.orderId).not.toBeDefined();
	})

	it("Acknowledges the message", async () => {
		const { data, listener, msg } = await orderCancelledSetup();		
		await listener.onMessage(data, msg);

		expect(msg.ack).toHaveBeenCalled();
	})

	it("Publishes the ticket updated event", async () => {
		const { data, listener, msg } = await orderCancelledSetup();
		await listener.onMessage(data, msg);
		expect(natsWrapper.client.publish).toHaveBeenCalled();
		const ticketData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
		expect(ticketData.orderId).not.toBeDefined();
		;		
	})
});