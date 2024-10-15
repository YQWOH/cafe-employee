import express, { Request, Response } from 'express';
import { cafesModel } from '../models/cafes.model';
import logger from '../utils/logger';
const router = express.Router();


export const cafesController = {
    getCafes: async (req: Request, res: Response): Promise<void> => {
        const location = req.query.location as string;

        try {
            logger.info(`Fetching cafes${location ? ` for location: ${location}` : ''}`);
            const cafes = await cafesModel.getCafes(location);

            if (cafes.length > 0) {
                logger.info(`Found ${cafes.length} cafes`);
                res.status(200).json(cafes);
            } else {
                logger.info('No cafes found');
                res.status(200).json([]);
            }
        } catch (error: any) {
            logger.error(`Error fetching cafes: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },
}

export default router;