import request from "supertest";
import { ObjectId } from "mongodb";

import app from "../../app";
import { getAuthCookie } from "../../test/helpers/signin";
import Ticket from "../../models/ticketModel";
import { createTicket } from "./helpers/ticket";

it("Has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});

    expect(response.status).not.toEqual(404);
});

it("Can only be accessed if the user is signed in.", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
});

it("Returns a status other that 401 if the user is signed in.", async () => {
    const cookie = getAuthCookie();
    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({});

    expect(response.status).not.toEqual(401);
});

it("Returns an error if an invalid title is provided.", async () => {
    const cookie = getAuthCookie();

    await request(app).post("/api/tickets").set("Cookie", cookie).send({ price: 10 }).expect(400);
    await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: 222, price: 10 }).expect(400);
});

it("Returns an error if an invalid price is provided.", async () => {
    const cookie = getAuthCookie();
    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "ticket title", price: "not valid price" })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "ticket title", price: -3 })
        .expect(400);
});


it("Creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0); // in test environment we start with 0 tickets

    await createTicket().expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});

it("Returns 404 if the ticket is not found.", async () => {
    await request(app).get(`/api/tickets/${new ObjectId().toString()}`).send().expect(404);
});

it("Returns the ticket if the ticket is found.", async () => {
    const cookie = getAuthCookie();
    const title = "valid title";
    const price = 43;

    const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title, price }).expect(201);
    const ticketResponse = await request(app).get(`/api/tickets/${response.body.data.ticket.id}`).send().expect(200);
    expect(ticketResponse.body.data.ticket.title).toEqual(title);
    expect(ticketResponse.body.data.ticket.price).toEqual(price);
});

it("Can fetch a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get("/api/tickets").send().expect(200);
    expect(response.body.data.tickets.length).toEqual(3);
});

it("Returns a 404 if the provided id doesn't exist.", async () => {
    const cookie = getAuthCookie();
    await request(app)
        .put(`/api/tickets/${new ObjectId().toString()}`)
        .set("Cookie", cookie)
        .send({ title: "title", price: 33 })
        .expect(404);
});

it("Returns a 401 if the user is not authenticated.", async () => {
    await request(app)
        .patch(`/api/tickets/${new ObjectId().toString()}`)
        .send({ price: 33 })
        .expect(401);
});

it("Returns a 401 if the user doesn't own the ticket.", async () => {
	const ticketResponse = await createTicket();
	const ticketId = ticketResponse.body.data.ticket.id;
	const cookie = getAuthCookie();

	await request(app)
        .patch(`/api/tickets/${ticketId}`)
		.set("Cookie", cookie) // Another user, cookie has different credentials
        .send({ price: 33 })
        .expect(401);
		
});
it("Returns a 400 if the user update the ticket and provided an invalid title or price.", async () => {
    const cookie = getAuthCookie();
	
	const ticketResponse = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: 'title', price: 5 }).expect(201);		
	const ticketId = ticketResponse.body.data.ticket.id;

	await request(app)
        .patch(`/api/tickets/${ticketId}`)
		.set("Cookie", cookie)
        .send({ price: 'a34' })
        .expect(400);
});

it("Update the ticket if the input is valid.", async () => {
	const cookie = getAuthCookie();
	const ticketResponse = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: 'title', price: 5 }).expect(201);		
	const ticketId = ticketResponse.body.data.ticket.id;

	const newTitle = 'New title';
	const updatedTicketResponse = await request(app)
        .patch(`/api/tickets/${ticketId}`)
		.set("Cookie", cookie)
        .send({ title: newTitle })
        .expect(200);
		console.log({updatedTicketResponse});
		

	expect(updatedTicketResponse.body.data.ticket.title).toEqual(newTitle)
});
