const routes = (handler) => [
  {
    method: 'POST',
    path: '/users', // k1: fitur registrasi pengguna
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
];

module.exports = routes;
