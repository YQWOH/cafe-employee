import express from 'express';
import { cafesController } from '../controllers/cafes.controller';
import logger from '../utils/logger';

export const router = express.Router();


router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all cafes');
        await cafesController.getCafes(req, res);
    } catch (error: any) {
        logger.error('Error fetching cafes: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});