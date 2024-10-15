import { Request, Response } from 'express';
import { employeeModel } from '../models/employee.model';
import logger from '../utils/logger';

export const employeeController = {
    getEmployees: async (req: Request, res: Response): Promise<void> => {
        const cafe = req.query.cafe as string;
        try {
            logger.info(`Fetching employees${cafe ? ` for cafe: ${cafe}` : ''}`);
            const employees = await employeeModel.getEmployees(cafe);
            logger.info(`Fetched ${employees.length} employees`);
            res.status(200).json(employees);
        } catch (error: any) {
            logger.error(`Error fetching employees: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    getEmployeeById: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            logger.info(`Fetching employee with ID: ${id}`);
            const employee = await employeeModel.getById(id);
            if (employee) {
                logger.info(`Employee found: ${employee.name}`);
                res.status(200).json(employee);
            } else {
                logger.warn(`Employee not found with ID: ${id}`);
                res.status(404).json({ message: 'Employee not found' });
            }
        } catch (error: any) {
            logger.error(`Error fetching employee by ID: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    createEmployee: async (req: Request, res: Response): Promise<void> => {
        const { name, email_address, phone_number, gender, cafe_id, start_date } = req.body;

        try {
            logger.info(`Creating new employee: ${name}`);
            const newEmployee = await employeeModel.create({ name, email_address, phone_number, gender });
            if (cafe_id && start_date) {
                await employeeModel.assignToCafe(newEmployee.id, cafe_id, start_date);
                logger.info(`Assigned employee ID: ${newEmployee.id} to cafe ID: ${cafe_id}`);
            }
            res.status(201).json(newEmployee);
        } catch (error: any) {
            logger.error(`Error creating employee: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    updateEmployee: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { name, email_address, phone_number, gender, cafe_id, start_date } = req.body;

        try {
            logger.info(`Updating employee with ID: ${id}`);
            const updatedEmployee = await employeeModel.update(id, { name, email_address, phone_number, gender });
            logger.info(`Employee updated with ID: ${id}`);
            if (cafe_id && start_date) {
                await employeeModel.assignToCafe(id, cafe_id, start_date);
                logger.info(`Assigned employee ID: ${id} to cafe ID: ${cafe_id}`);
            }
            res.status(200).json(updatedEmployee);
        } catch (error: any) {
            logger.error(`Error updating employee: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },

    deleteEmployee: async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            logger.info(`Deleting employee with ID: ${id}`);
            const deleted = await employeeModel.delete(id);
            if (deleted) {
                logger.info(`Employee deleted with ID: ${id}`);
                res.status(200).json({ message: 'Employee deleted' });
            } else {
                logger.warn(`Employee not found with ID: ${id}`);
                res.status(404).json({ message: 'Employee not found' });
            }
        } catch (error: any) {
            logger.error(`Error deleting employee: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },
};
