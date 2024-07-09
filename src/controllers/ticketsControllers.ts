import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import { NotFoundError } from "@omer-ticketing/common";

export const createNewTicket = async (req: Request, res: Response): Promise<void> => {
    const { title, price } = req.body;

    const ticket = await Ticket.build({ title, price, userId: req.user!.id });

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
