import express from "express";
import * as ticketsController from "../controllers/ticketsControllers";
import { authMiddlewares, validateRequest } from "@omer-ticketing/common";
import * as ticketValidation from "../utils/ticketValidators";

const router = express.Router();

router
    .route("/")
    .post(
        authMiddlewares.protect,
        [...ticketValidation.titleValidation, ...ticketValidation.priceValidation],
        validateRequest,
        ticketsController.createNewTicket
    )
    .get(ticketsController.getTickets);

router
    .route("/:id")
    .get(ticketsController.getTicket)
    .patch(
        authMiddlewares.protect,
        [ticketValidation.titleIsStringValidation, ticketValidation.priceIsPositiveNumberValidation],
        validateRequest,
        ticketsController.updateTicket
    );

export default router;
