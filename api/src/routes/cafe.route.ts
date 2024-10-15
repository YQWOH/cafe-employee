import express from 'express';
import { cafeController } from '../controllers/cafe.controller';
import logger from '../utils/logger';

export const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all cafes');
        await cafeController.getAllCafes(req, res);
    } catch (error: any) {
        logger.error('Error fetching cafes: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        logger.info(`Fetching cafe with ID ${req.params.id}`);
        await cafeController.getCafeById(req, res);
    } catch (error: any) {
        logger.error('Error fetching cafe by ID: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        logger.info('Creating a new cafe');
        await cafeController.createCafe(req, res);
    } catch (error: any) {
        logger.error('Error creating cafe: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        logger.info(`Updating cafe with ID ${req.params.id}`);
        await cafeController.updateCafe(req, res);
    } catch (error: any) {
        logger.error('Error updating cafe: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        logger.info(`Deleting cafe with ID ${req.params.id}`);
        await cafeController.deleteCafe(req, res);
    } catch (error: any) {
        logger.error('Error deleting cafe: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});
