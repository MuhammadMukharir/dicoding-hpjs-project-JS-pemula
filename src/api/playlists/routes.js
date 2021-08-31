const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler, // k5: fitur menambahkan playlist
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler, // k6: fitur melihat daftar playlist yang dimiliki
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler, // k7: fitur menghapus playlist
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs', // k8: fitur menambahkan lagu ke playlist
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getSongsFromPlaylistByIdHandler, // k9: fitur melihat daftar lagu pada playlist
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deleteSongFromPlaylistByIdHandler, // k10: fitur menghapus lagu dari playlist
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
