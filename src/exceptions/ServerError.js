const ServerError = (error, h) => {
  console.error(error);
  const response = h.response({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
  response.code(500);
  return response;
}

module.exports = { ServerError };