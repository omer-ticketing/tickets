import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@omer-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}