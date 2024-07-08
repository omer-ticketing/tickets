import { Request, Response } from 'express';

export const createNewTicket = async (req: Request, res: Response): Promise<void> => {
	res.status(201).json({
		status: 'success',
		data: {
			ticket: {}
		}
	})
}