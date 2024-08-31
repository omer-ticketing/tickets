import { Listener, NotFoundError, OrderCancelledEvent, Subjects } from "@omer-ticketing/common";
import { QUEUE_GROUP_NAME } from "./constants";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticketModel";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCancelledLIstener extends Listener<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticketId);
		if (!ticket) {
			throw new NotFoundError("Ticket was not found");
		}

		ticket.set({ orderId: undefined });
		await ticket.save();

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.version
		})
		
		msg.ack();
	}
}