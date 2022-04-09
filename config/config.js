import dotenv from "dotenv";

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: "dvuzraoocayzdd",
    password: "312b2238327d31a40d29268949b409cdc49319355e0aa3cf7f2350c8b39b4cb2",
    database: "d82v0condqgl9h",
    host: "ec2-54-173-77-184.compute-1.amazonaws.com",
    dialect: "postgres",
  },
};

export default config;
