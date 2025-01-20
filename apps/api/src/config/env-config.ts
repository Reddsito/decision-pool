export const envConfig = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  clientPort: parseInt(process.env.CLIENT_PORT, 10),
});
