const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD || null, // Handle empty password
  port: parseInt(process.env.DB_PORT, 10),
};

let client;

async function connectToDatabase() {
  if (!client) {
    client = new Client(dbConfig);
    try {
      await client.connect();
      console.log('Connected to the database successfully.');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      process.exit(1);
    }
  }
  return client;
}

async function query(text, params) {
  const client = await connectToDatabase();
  const res = await client.query(text, params);
  return res;
}

module.exports = { connectToDatabase, query };