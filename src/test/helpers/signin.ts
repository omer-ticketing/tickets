import jwt from "jsonwebtoken";

export const getAuthCookie = (): string[] => {
    const payload = { id: "test-id123", email: "test@test.com" };
    const token = jwt.sign(payload, process.env.JWT_SECRET!);
    const session = { jwt: token };
    const base64 = Buffer.from(JSON.stringify(session)).toString("base64");

    return [`session=${base64}`];
};