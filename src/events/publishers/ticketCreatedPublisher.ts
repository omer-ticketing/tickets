import { Publisher, Subjects, TicketCreatedEvent } from "@omer-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}