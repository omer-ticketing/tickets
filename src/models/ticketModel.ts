import mongoose from 'mongoose';
import { TicketAttrs, TicketDoc, TicketModel } from './ticketInterface';

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "A ticket must have a title."]
	},
	price: {
		type: Number,
		required: [true, "A ticket must have a price."]
	},
},{
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
			delete ret.__v;
		}
	}
});

ticketSchema.statics.build = async (attrs: TicketAttrs) => await Ticket.create(attrs);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;