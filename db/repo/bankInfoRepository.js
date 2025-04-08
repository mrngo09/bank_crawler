import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import logger from "../../utils/logger.js";
dotenv.config();

class BankInfoRepository {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
  }

  // Initialize the database table
  async initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS bankinfo (
        id SERIAL PRIMARY KEY,
        account_number VARCHAR(50) UNIQUE NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        bank_name VARCHAR(100) NOT NULL
      );
    `;
    await this.pool.query(createTableQuery);
  }

  // Create a new bank info entry
  async create({ account_number, account_name, bank_name }) {
    try {
      const checkQuery = "SELECT id FROM bankinfo WHERE account_number = $1";
      const checkResult = await this.pool.query(checkQuery, [account_number]);
      if (checkResult.rows.length == 0) {
        const insertQuery = `
        INSERT INTO bankinfo (account_number, account_name, bank_name)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
        const values = [account_number, account_name, bank_name];
        const result = await this.pool.query(insertQuery, values);
        return result.rows[0];
      }
      return { status: 409, message: `${account_number} is conflicted.` };
    } catch (err) {
      logger.error(`Error when created: ${err.message}`);
      //   throw err; // Re-throw to be caught by the caller
    }
  }

  // Read all bank info entries
  async findAll() {
    try {
      const result = await this.pool.query("SELECT * FROM bankinfo");
      return result.rows;
    } catch (err) {
      logger.error(`Failed to initialize database: ${err.message}`);
      //   throw err; // Re-throw to be caught by the caller
    }
  }

  // Read a bank info entry by ID
  async findById(id) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM bankinfo WHERE id = $1",
        [id]
      );
      if (result.rows.length === 0) {
        return { message: "Bank info not found" };
      }
      return result.rows[0];
    } catch (err) {
      logger.error(` ${err.message}`);
      //   throw err; // Re-throw to be caught by the caller
    }
  }

  async findByAccountNo(account_number) {
    const result = await this.pool.query(
      "SELECT * FROM bankinfo WHERE account_number = $1",
      [account_number]
    );
    if (result.rows.length == 0) {
      return { message: "Bank info not found" };
    }
    return result.rows[0];
  }
  catch(err) {
    logger.error(` ${err.message}`);
    //   throw err; // Re-throw to be caught by the caller
  }

  //   // Update a bank info entry
  //   async update(id, { account_number, account_name, bank_name }) {
  //     try {
  //       const queryText = `
  //       UPDATE bankinfo
  //       SET account_number = $1, account_name = $2, bank_name = $3
  //       WHERE id = $4
  //       RETURNING *;
  //     `;
  //       const values = [account_number, account_name, bank_name, id];
  //       const result = await this.pool.query(queryText, values);
  //       if (result.rows.length === 0) {
  //         throw new Error("Bank info not found");
  //       }
  //       return result.rows[0];
  //     } catch (err) {
  //       logger.error(`Failed to initialize database: ${err.message}`);
  //       //   throw err; // Re-throw to be caught by the caller
  //     }
  //   }

  //   // Delete a bank info entry
  //   async delete(id) {
  //     try {
  //       const result = await this.pool.query(
  //         "DELETE FROM bankinfo WHERE id = $1 RETURNING *",
  //         [id]
  //       );
  //       if (result.rows.length === 0) {
  //         throw new Error("Bank info not found");
  //       }
  //       return result.rows[0];
  //     } catch (err) {
  //       logger.error(`Failed to initialize database: ${err.message}`);
  //       //   throw err; // Re-throw to be caught by the caller
  //     }
  //   }

  // Retry logic for database connection
  //   async connectWithRetry(maxAttempts = 10, delayMs = 2000) {
  //     try {
  //       for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  //         try {
  //           const client = await this.pool.connect();
  //           console.log("Database connected successfully");
  //           client.release();
  //           return true;
  //         } catch (err) {
  //           console.log(`Connection attempt ${attempt} failed: ${err.message}`);
  //           if (attempt === maxAttempts) throw err;
  //           await new Promise((resolve) => setTimeout(resolve, delayMs));
  //         }
  //       }
  //     } catch (err) {
  //       logger.error(`Failed to initialize database: ${err.message}`);
  //       //   throw err; // Re-throw to be caught by the caller
  //     }
  //   }

  // Clean up pool on shutdown

  async close() {
    await this.pool.end();
  }
}

export default BankInfoRepository;
