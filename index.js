import express, { json } from "express";
import pkg from "pg";
const { Pool } = pkg;
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import open from "open";
import BankInfoRepository from "./db/repo/bankInfoRepository.js";
import logger from "./utils/logger.js";
const bankInfoRepository = new BankInfoRepository();
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(json());
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "BankInfo API",
      version: "1.0.0",
      description: "A simple CRUD API for managing bank information",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./index.js"], // Point to this file for JSDoc comments
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// PostgreSQL connection pool
const pool = new Pool({
  user: "myuser",
  host: "", // Matches Docker Compose service name
  database: "bankcrawler",
  password: "mypassword",
  port: 5432,
});

// Create the bankinfo table if it doesn’t exist
async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bankinfo (
      id SERIAL PRIMARY KEY,
      account_number VARCHAR(50) UNIQUE NOT NULL, -- Added UNIQUE constraint
      account_name VARCHAR(100) NOT NULL,
      bank_name VARCHAR(100) NOT NULL
    );
  `;
  await pool.query(createTableQuery);
  console.log("Database initialized");
}

// CRUD Endpoints

// CREATE: Add a new bank info entry with validation
/**
 * @swagger
 * /bankinfo:
 *   post:
 *     summary: Create a new bank info entry
 *     tags: [BankInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_number
 *               - account_name
 *               - bank_name
 *             properties:
 *               account_number:
 *                 type: string
 *                 example: "1234567890"
 *               account_name:
 *                 type: string
 *                 example: "John Doe"
 *               bank_name:
 *                 type: string
 *                 example: "Example Bank"
 *     responses:
 *       201:
 *         description: Bank info created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 account_number:
 *                   type: string
 *                 account_name:
 *                   type: string
 *                 bank_name:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Duplicate account number
 *       500:
 *         description: Server error
 */
app.post("/bankinfo", async (req, res) => {
  const { account_number, account_name, bank_name } = req.body;

  // Check if all required fields are provided
  if (!account_number || !account_name || !bank_name) {
    return res.status(400).json({
      error:
        "All fields (account_number, account_name, bank_name) are required",
    });
  }

  try {
    const response = await bankInfoRepository.create({
      account_name,
      account_number,
      bank_name,
    });
    if (response.status === 409) {
      return res.status(409).json(response);
    }
    res.json(response);
  } catch (err) {
    logger.error(`Failed to create bank info: ${err.message}`);
    res
      .status(500)
      .json({ error: `Failed to create bank info: ${err.message}` });
  }
});

// READ: Get all bank info entries
/**
 * @swagger
 * /bankinfo:
 *   get:
 *     summary: Retrieve all bank info entries
 *     tags: [BankInfo]
 *     responses:
 *       200:
 *         description: List of bank info entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   account_number:
 *                     type: string
 *                   account_name:
 *                     type: string
 *                   bank_name:
 *                     type: string
 *       500:
 *         description: Server error
 */
app.get("/bankinfo", async (req, res) => {
  try {
    const response = await bankInfoRepository.findAll();
    res.json(response);
  } catch (err) {
    logger.error(`Failed to fetch bank info: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

// READ: Get a single bank info entry by ID
app.get("/bankinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await bankInfoRepository.findById(id);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // UPDATE: Modify an existing bank info entry
// app.put("/bankinfo/:id", async (req, res) => {
//   const { id } = req.params;
//   const { account_number, account_name, bank_name } = req.body;
//   if (!account_number || !account_name || !bank_name) {
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   try {
//     const queryText = `
//       UPDATE bankinfo
//       SET account_number = $1, account_name = $2, bank_name = $3
//       WHERE id = $4
//       RETURNING *;
//     `;
//     const values = [account_number, account_name, bank_name, id];
//     const result = await pool.query(queryText, values);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Bank info not found" });
//     }
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE: Remove a bank info entry
// app.delete("/bankinfo/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       "DELETE FROM bankinfo WHERE id = $1 RETURNING *",
//       [id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Bank info not found" });
//     }
//     res.json({ message: "Deleted successfully", deleted: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Start the server
app.listen(port, async () => {
  try {
    await initializeDatabase();
    console.log(`Server running on port ${port}`);
    // open(`http://localhost:${port}/api-docs`);
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
});
