export default () => ({
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3001,
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt_secret_key: process.env.JWT_SECRET,
});
