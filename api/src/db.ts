import mysql, { Pool } from 'mysql2/promise';
import config from './config';
import logger from './utils/logger';

export const initializeDB = async (): Promise<Pool> => {
    try {
        logger.info('Initializing database connection...');
        const poolWithoutDB = mysql.createPool({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            waitForConnections: config.database.waitForConnections,
            connectionLimit: config.database.connectionLimit,
            queueLimit: config.database.queueLimit
        });

        const connection = await poolWithoutDB.getConnection();
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database.database}\``);
        connection.release();

        const poolWithDB = mysql.createPool({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            waitForConnections: config.database.waitForConnections,
            connectionLimit: config.database.connectionLimit,
            queueLimit: config.database.queueLimit,
        });

        logger.info('Database initialized successfully.');
        return poolWithDB;
    } catch (error) {
        logger.error('Error initializing database:', error);
        throw error;
    }
};

export const createTables = async (pool: Pool) => {
    try {
        logger.info('Creating tables...');
        const connection = await pool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cafes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255),
                logo VARCHAR(255)
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id VARCHAR(10) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email_address VARCHAR(255),
                phone_number VARCHAR(15),
                gender ENUM('Male', 'Female') NOT NULL
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS employee_cafe (
                employee_id VARCHAR(10),
                cafe_id INT,
                start_date DATE,
                PRIMARY KEY (employee_id, cafe_id),  -- Composite primary key to prevent duplicates
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
                FOREIGN KEY (cafe_id) REFERENCES cafes(id) ON DELETE CASCADE
            );
        `);

        connection.release();
        logger.info('Tables ensured to exist.');
    } catch (error) {
        logger.error('Error creating tables:', error);
        throw error;
    }
};


export const seedData = async (pool: Pool) => {
    try {
        logger.info('Inserting seed data...');
        const connection = await pool.getConnection();

        await connection.query(`
            INSERT IGNORE INTO cafes (id, name, description, location) VALUES 
            (1, 'Cafe Java', 'A cozy cafe for developers', 'San Francisco'),
            (2, 'Cafe Latte', 'The perfect place for coffee lovers', 'New York');
        `);

        await connection.query(`
            INSERT IGNORE INTO employees (id, name, email_address, phone_number, gender) VALUES
            ('UI1234567', 'John Doe', 'john.doe@example.com', '91234567', 'Male'),
            ('UI7654321', 'Jane Smith', 'jane.smith@example.com', '81234567', 'Female');
        `);

        await connection.query(`
            INSERT INTO employee_cafe (employee_id, cafe_id, start_date) VALUES
            ('UI1234567', 1, '2023-01-01'),
            ('UI7654321', 2, '2023-02-01')
            ON DUPLICATE KEY UPDATE start_date = VALUES(start_date);
        `);

        connection.release();
        logger.info('Seed data inserted (with relationship handling).');
    } catch (error) {
        logger.error('Error inserting seed data:', error);
        throw error;
    }
};