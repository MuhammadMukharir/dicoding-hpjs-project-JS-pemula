const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  // Creating a new song
  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title, year, performer, genre, duration,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, performer, genre, duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  // Getting list of songs
  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  // Getting a song detail
  async getSongByIdHandler(request, h) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  // Updating an existing song
  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  // Deleting an existing song
  async deleteSongByIdHandler(request, h) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
