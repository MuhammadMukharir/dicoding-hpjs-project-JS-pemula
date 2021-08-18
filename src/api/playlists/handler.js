const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  // k5: fitur menambahkan playlist 
  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner});

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }
  
  // k6: fitur melihat daftar playlist yang dimiliki
  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  // k7: fitur menghapus playlist
  async deletePlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, owner);

    await this._service.deletePlaylistById(playlistId);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  // k8: fitur menambahkan lagu ke playlist
  async postSongToPlaylistHandler(request, h) {
    await this._validator.validatePostSongToPlaylistPayload(request.payload)
    
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    
    const { songId } = request.payload;

    await this._service.addSongToPlaylist(playlistId, songId);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  // k9: fitur melihat daftar lagu pada playlist
  async getSongsFromPlaylistByIdHandler(request, h) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    const songs = await this._service.getSongsFromPlaylistById(playlistId);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // k10: fitur menghapus lagu dari playlist
  async deleteSongFromPlaylistByIdHandler(request, h) {
    this._validator.validateDeleteSongFromPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
