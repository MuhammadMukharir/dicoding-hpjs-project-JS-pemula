const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',                         // k2: fitur login pengguna
    handler: handler.postAuthenticationHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',                         // k3: fitur refresh access token
    handler: handler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',                         // k4: fitur logout pengguna
    handler: handler.deleteAuthenticationHandler,
  },
];
 
module.exports = routes;