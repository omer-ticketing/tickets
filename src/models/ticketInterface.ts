import mongoose from "mongoose";

export interface TicketAttrs {
    title: string;
    price: number;
	userId: string;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	version: number;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): Promise<TicketDoc>;
}

