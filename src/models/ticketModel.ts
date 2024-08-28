import mongoose from 'mongoose';
import { TicketAttrs, TicketDoc, TicketModel } from './ticketInterface';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "A ticket must have a title."]
	},
	price: {
		type: Number,
		required: [true, "A ticket must have a price."]
	},
	userId: {
		type: String,
		required: [true, "A ticket must have a user id"]
	}
},{
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
		}
	}
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => Ticket.create(attrs);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);


export default Ticket;