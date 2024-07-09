import request from "supertest";
import { ObjectId } from 'mongodb';

import app from "../../app";
import { getAuthCookie } from "../../test/helpers/signin";
import Ticket from "../../models/ticketModel";

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
    const cookie = getAuthCookie();
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0); // in test environment we start with 0 tickets

    await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: "title", price: 30 }).expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
});

it("Returns 404 if the ticket is not found.", async () => {
	console.log(new ObjectId());
	
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
