const Sentry = require('@sentry/node');
const boom = require('boom');
const { config } = require('../../config');
const isRequestAjaxOrApi = require('../isRequestAjaxOrApi');

Sentry.init({ dsn: `${config.sentryDns}@sentry.io/${config.sentryId}` });

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack } // Object.assign({}, err, stack)
  }
}

function logErrors(err, req, res, next) {
  Sentry.captureException(err);
  console.log(err.stack);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    next(boom.badImplementation(err))
  }

  next(err);
}

function clientErrorHandlers(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;

  // catch error for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack));
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload }
  } = err;

  if (!config.dev) {
    delete err.stack;
  }

  res.status(err.statusCode);
  res.render('error', withErrorStack(payload, err.stack))
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandlers,
  errorHandler
}