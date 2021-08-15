const ClientError = require('./ClientError');
const { ServerError } = require('./ServerError');

const ErrorHandler = (error, h) => {
  if (error instanceof ClientError) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(error.statusCode);
    return response;
  }

  return ServerError(error, h)
};

module.exports = { ErrorHandler };