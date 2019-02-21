const path = require('path');
const debug = require('debug')('app:server')
const express = require('express');
const bodyParser = require('body-parser');
const boom = require('boom');

// external routes
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');

// error handlers
const {
  logErrors,
  wrapErrors,
  clientErrorHandlers,
  errorHandler
} = require('./utils/middlewarre/errorsHandler')

const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');

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

app.use(function(req, res, next) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload }
    } = boom.notFound();

    res.status(statusCode).json(payload);
  }

  res.status(404).render('404');
})

// erros handlers middlewares
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandlers);
app.use(errorHandler);

app.listen(port, () => {
  debug(`Server listening on http://localhost:${port}/`);
})