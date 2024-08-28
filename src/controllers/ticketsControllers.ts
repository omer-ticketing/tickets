import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import { NotAuthorizedError, NotFoundError } from "@omer-ticketing/common";
import { TicketCreatedPublisher } from "../events/publishers/ticketCreatedPublisher";
import natsWrapper from "../natsWrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticketUpdatedPublisher";

export const createNewTicket = async (req: Request, res: Response): Promise<void> => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({ title, price, userId: req.user!.id });
	
	new TicketCreatedPublisher(natsWrapper.client).publish({
		id: ticket.id,
		title: ticket.title,
		price: ticket.price,
		userId: ticket.userId,
		version: ticket.version
	});
	
    res.status(201).json({
        status: "success",
        data: {
            ticket,
        },
    });
};

export const getTicket = async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);
	
    if (!ticket) {
        throw new NotFoundError("Ticket was not found.");
    }

    res.status(200).json({ status: "success", data: { ticket } });
};

export const getTickets = async (req: Request, res: Response): Promise<void> => {
    const tickets = await Ticket.find({});

    res.status(200).json({ status: "success",results: tickets.length, data: { tickets } });
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
	const ticket = await Ticket.findById(req.params.id);
	
	if (!ticket) {
		throw new NotFoundError("The ticket was not found.");
	}
	
	if (ticket.userId !== req.user!.id) {
		throw new NotAuthorizedError('You are not authorized to update the ticket')
	}
	
	ticket.set(req.body);
	await ticket.save();

	new TicketUpdatedPublisher(natsWrapper.client).publish({
		id: ticket.id,
		title: ticket.title,
		price: ticket.price,
		userId: ticket.userId,
		version: ticket.version
	});
	
    res.status(200).json({ status: "success", data: { ticket } });
};
