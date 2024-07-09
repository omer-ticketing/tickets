import request from "supertest";
import app from "../../app";
import { getAuthCookie } from "../../test/helpers/signin";

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
	
});
