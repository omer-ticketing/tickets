import { body } from "express-validator";

const titleExistValidation = body("title").not().isEmpty().withMessage("Title is required.");
const titleIsStringValidation = body("title").isString().withMessage("Title should be a string.");

export const titleValidation = [titleExistValidation, titleIsStringValidation];
export const priceValidation = [body("price").isFloat({ gt: 0 }).withMessage("Price must be greater that zero.")];
