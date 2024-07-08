import express from 'express';
import * as ticketsController from '../controllers/ticketsControllers';

const router = express.Router();

router.post('/', ticketsController.createNewTicket);

export default router;