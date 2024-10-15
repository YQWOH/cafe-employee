import express from "express";
import { initializeDB, seedData, createTables } from './db';
const app = express();
import { router as cafesRoutes } from "./routes/cafes.route";
import { router as cafeRoutes } from "./routes/cafe.route";
import { router as employeesRoutes } from "./routes/employees.route";
import { router as employeeRoutes } from "./routes/employee.route";
import cors from "cors";
import logger from "./utils/logger";

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use("/api/cafes", cafesRoutes);
app.use("/api/cafe", cafeRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/employee", employeeRoutes);

initializeDB()
    .then(async (pool) => {
        logger.info("Database connection established");

        await createTables(pool);
        logger.info("Database tables created");

        await seedData(pool);
        logger.info("Database seeded with initial data");

        app.listen(8800, () => {
            logger.info("Server started on port 8800");
            console.log("API working!");
        });
    })
    .catch((error) => {
        logger.error(`Failed to initialize database: ${error.message}`);
        process.exit(1);
    });
