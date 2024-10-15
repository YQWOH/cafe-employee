import { Request, Response } from 'express';
import { employeesModel } from '../models/employees.model';
import logger from '../utils/logger';

export const employeesController = {
    getEmployees: async (req: Request, res: Response): Promise<void> => {
        const cafe = req.query.cafe as string;

        try {
            logger.info(`Fetching employees${cafe ? ` for cafe: ${cafe}` : ''}`);
            const employees = await employeesModel.getEmployees(cafe);

            if (employees.length > 0) {
                logger.info(`Fetched ${employees.length} employees`);
                res.status(200).json(employees);
            } else {
                logger.info(`No employees found${cafe ? ` for cafe: ${cafe}` : ''}`);
                res.status(200).json([]);
            }
        } catch (error: any) {
            logger.error(`Error fetching employees: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    },
};
