import { body } from "express-validator";

export const titleExistValidation = body("title").not().isEmpty().withMessage("Title is required.");
export const titleIsStringValidation = body("title")
    .isString()
    .optional({ values: "falsy" })
    .withMessage("Title should be a string.");

export const titleValidation = [titleExistValidation, titleIsStringValidation];
export const priceExistValidation = body("price").not().isEmpty().withMessage("Price is required.");
export const priceIsPositiveNumberValidation = body("price")
    .isFloat({ gt: 0 })
    .optional({ values: "falsy" })
    .withMessage("Price should be a a positive number.");

export const priceValidation = [priceExistValidation, priceIsPositiveNumberValidation];
