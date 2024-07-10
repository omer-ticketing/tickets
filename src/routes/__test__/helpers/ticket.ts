import app from "../../../app";
import { getAuthCookie } from "../../../test/helpers/signin";
import request from 'supertest';

export const createTicket = () => {
    const cookie = getAuthCookie();
    return request(app).post("/api/tickets").set("Cookie", cookie).send({ title: "title", price: 23 });
};