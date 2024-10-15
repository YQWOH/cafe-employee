import express from 'express';
import { employeesController } from '../controllers/employees.controller';
import logger from '../utils/logger';

export const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching all employees');
        await employeesController.getEmployees(req, res);
    } catch (error: any) {
        logger.error('Error fetching employees: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});