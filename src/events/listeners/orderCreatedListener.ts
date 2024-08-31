import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@omer-ticketing/common";
import { QUEUE_GROUP_NAME } from "./constants";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticketModel";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
			throw new NotFoundError("Ticket was not found.");
        }

		ticket.set({ orderId: data.id });
		await ticket.save();
			
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.version
		});

		msg.ack();
    }
}
