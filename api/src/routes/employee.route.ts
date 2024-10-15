import express from 'express';
import { employeeController } from '../controllers/employee.controller';
import logger from '../utils/logger';

export const router = express.Router();

router.get('/', async (req, res) => {
    try {
        logger.info('Fetching employees');
        await employeeController.getEmployees(req, res);
    } catch (error: any) {
        logger.error('Error fetching employees: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        logger.info(`Fetching employee with ID ${req.params.id}`);
        await employeeController.getEmployeeById(req, res);
    } catch (error: any) {
        logger.error('Error fetching employee by ID: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        logger.info('Creating new employee');
        await employeeController.createEmployee(req, res);
    } catch (error: any) {
        logger.error('Error creating employee: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        logger.info(`Updating employee with ID ${req.params.id}`);
        await employeeController.updateEmployee(req, res);
    } catch (error: any) {
        logger.error('Error updating employee: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        logger.info(`Deleting employee with ID ${req.params.id}`);
        await employeeController.deleteEmployee(req, res);
    } catch (error: any) {
        logger.error('Error deleting employee: %s', error.message);
        res.status(500).send('Internal Server Error');
    }
});
