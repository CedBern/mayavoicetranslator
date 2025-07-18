require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
  },
  resourcesPath: process.env.RESOURCES_PATH,
  analysisApiUrl: process.env.ANALYSIS_API_URL,
  labAccessKey: process.env.LAB_ACCESS_KEY,
  dictionaryPath: process.env.DICTIONARY_PATH,
  apiKey: process.env.API_KEY,
  nodeEnv: process.env.NODE_ENV,
};
