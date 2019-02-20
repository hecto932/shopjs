const path = require('path');
const debug = require('debug')('app:server')
const express = require('express');
const bodyParser = require('body-parser');

// external routes
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');

// error handlers
const {
  logErrors,
  clientErrorHandlers,
  errorHandler
} = require('./utils/middlewarre/errorsHandler')

// port
const port = process.env.PORT || 3000;

// app 
const app = express();

// app middlewares
app.use(bodyParser.json())

// static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.use('/products', productsRouter);
productsApiRouter(app);

// redirect
app.get('/', function (req, res) {
  res.redirect('/products')
})

// erros handlers middlewares
app.use(logErrors);
app.use(clientErrorHandlers);
app.use(errorHandler);

app.listen(port, () => {
  debug(`Server listening on http://localhost:${port}/`);
})