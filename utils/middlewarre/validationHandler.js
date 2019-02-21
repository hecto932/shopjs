const Joi = require('joi');
const boom = require('boom');

function validate(data, schema) {
  const { error } = Joi.validate(data, schema);
  return error;
}

function validationHandler(schema, check = 'body') {
  return function (req, res, next) {
    const error = validate(req[check], schema);
    error ? next(boom.badRequest(err)) : next();
    // error ? next(new Error(error)) : next();
  }
}

module.exports = validationHandler;