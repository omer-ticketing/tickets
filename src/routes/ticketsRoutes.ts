import express from "express";
import * as ticketsController from "../controllers/ticketsControllers";
import { authMiddlewares, validateRequest } from "@omer-ticketing/common";
import * as ticketValidation from "../../utils/ticketValidators";

const router = express.Router();

router.post("/",
	authMiddlewares.protect,
	[...ticketValidation.titleValidation, ...ticketValidation.priceValidation],
	validateRequest,
	ticketsController.createNewTicket
);

export default router;
