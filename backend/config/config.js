module.exports = {
  PORT: process.env.PORT || 4000,
  cors: { origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'] }
}
