const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const authApiRouter = require('./routes/api/auth');
const boom = require('boom');
const debug = require('debug')('app:server');
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');
const { config } = require('./config');

const {
  logErrors,
  clientErrorHandlers,
  wrapErrors,
  errorHandler
} = require('./utils/middlewares/errorHandlers');

// app
const app = express();

// middlewares
app.use(helmet());
app.use(bodyParser.json());

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.use('/products', productsRouter);
productsApiRouter(app);
app.use('/api/auth', authApiRouter);

// redirects
app.get('/', function (req, res) {
  res.redirect('/products');
});

app.use(function(req, res, next) {
  if (isRequestAjaxOrApi(req)) {
    const {
      output: { statusCode, payload }
    } = boom.notFound();
    res.status(statusCode).json(payload);
  }
  res.status(404).render('404');
});

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandlers);
app.use(errorHandler);


// server
const server = app.listen(config.port, function () {
  debug(`Listening http://localhost:${server.address().port}`);
});