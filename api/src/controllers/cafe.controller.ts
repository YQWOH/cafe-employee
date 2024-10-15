import { Request, Response } from 'express';
import { cafeModel } from '../models/cafe.model';
import logger from '../utils/logger';

export const cafeController = {
    getAllCafes: async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Fetching all cafes');
            const cafes = await cafeModel.getAll();
            logger.info('Fetched all cafes successfully');
            res.status(200).json(cafes);
        } catch (error: any) {
            logger.error(`Error fetching cafes: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    getCafeById: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            logger.info(`Fetching cafe with ID: ${id}`);
            const cafe = await cafeModel.getById(id);
            if (cafe) {
                logger.info(`Fetched cafe with ID: ${id} successfully`);
                res.status(200).json(cafe);
            } else {
                logger.warn(`Cafe with ID: ${id} not found`);
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            logger.error(`Error fetching cafe with ID ${id}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    createCafe: async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Creating a new cafe');
            const newCafe = await cafeModel.create(req.body);
            logger.info('Created new cafe successfully');
            res.status(201).json(newCafe);
        } catch (error: any) {
            logger.error(`Error creating cafe: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    updateCafe: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            logger.info(`Updating cafe with ID: ${id}`);
            const updatedCafe = await cafeModel.update(id, req.body);
            if (updatedCafe) {
                logger.info(`Updated cafe with ID: ${id} successfully`);
                res.status(200).json(updatedCafe);
            } else {
                logger.warn(`Cafe with ID: ${id} not found for update`);
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            logger.error(`Error updating cafe with ID ${id}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    deleteCafe: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            logger.info(`Deleting cafe with ID: ${id} and associated employees`);
            await cafeModel.deleteEmployeesByCafe(id);

            const deleted = await cafeModel.delete(id);

            if (deleted) {
                logger.info(`Deleted cafe with ID: ${id} and associated employees`);
                res.status(200).json({ message: 'Cafe and associated employees deleted' });
            } else {
                logger.warn(`Cafe with ID: ${id} not found for deletion`);
                res.status(404).json({ message: 'Cafe not found' });
            }
        } catch (error: any) {
            logger.error(`Error deleting cafe with ID ${id}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },
};