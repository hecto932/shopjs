const Sentry = require('@sentry/node');
const { config } = require('../../config');

Sentry.init({ dsn: `${config.sentryDns}@sentry.io/${config.sentryId}` });

function logErrors(err, req, res, next) {
  Sentry.captureException(err);
  console.log(err.stack);
  next(err);
}

function clientErrorHandlers(err, req, res, next) {
  // catch error for AJAX request
  if (req.xhr) {
    res.status(500).json({ err: err.message });
  } else {
    next(err)
  }
}

function errorHandler(err, req, res, next) {
  // catch error while streaming
  if (res.headersSent) {
    next(err)
  }

  if (!config.dev) {
    delete err.stack;
  }

  res.status(err.status || 500);
  res.render('error', { error: err })
}

module.exports = {
  logErrors,
  clientErrorHandlers,
  errorHandler
}