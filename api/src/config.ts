const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'your_password',
        database: process.env.DB_NAME || 'cafe_manager',
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
        waitForConnections: true,
        queueLimit: 0,
    },
};

export default config;
