import express from 'express';
import * as ticketsController from '../controllers/ticketsControllers';
import { authMiddlewares } from '@omer-ticketing/common';

const router = express.Router();

router.post('/',authMiddlewares.protect, ticketsController.createNewTicket);

export default router;