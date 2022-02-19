const { searchRouter } = require('./search.js');
const { authRouter } = require('./auth.js')

/*This is where we organize the endpoints that we use to call functions in the
associated route file.*/
module.exports = (app) => {
  app.use('/routes/search/', searchRouter);
  app.use('/auth/', authRouter);
};
