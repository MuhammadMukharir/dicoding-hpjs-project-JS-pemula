// const ClientError = require('../../exceptions/ClientError');

const Joi = require('joi');

class SongsHandler {
  constructor(service) {
    this._service = service;

    this._SongPayloadSchema = Joi.object({
      title: Joi.string().required(),
      year: Joi.number().required(),
      performer: Joi.string().required(),
      genre: Joi.string().required(),
      duration: Joi.number().required(),
    });

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // Creating a new song
  async postSongHandler(request, h) {
    try {
      const h_resp = { status: 'fail', message: '' };
      const validationResult = this._SongPayloadSchema.validate(request.payload);

      // if validation error
      if (validationResult.error) {
        // console.log(`Validation error: ${validationResult.error.message}`);
        h_resp.message = validationResult.error.message;
        return h.response(h_resp).code(400);
      }

      const {
        title, year, performer, genre, duration,
      } = request.payload;

      const songId = await this._service.addSong({
        title, year, performer, genre, duration,
      });

      h_resp.status = 'success';
      h_resp.message = 'Lagu berhasil ditambahkan';
      h_resp.data = { songId };

      return h.response(h_resp).code(201);
    } catch (error) {
      const h_resp = { status: '', message: '' };

      if (error.message === 'Lagu gagal ditambahkan') {
        h_resp.status = 'fail';
        h_resp.message = error.message;
        return h.response(h_resp).code(400);
      }

      // Server ERROR!
      console.error(error);
      h_resp.status = 'error';
      h_resp.message = 'Maaf, terjadi kegagalan pada server kami.';

      return h.response(h_resp).code(500);
    }
  }

  // Getting list of songs
  async getSongsHandler(request, h) {
    try {
      const songs = await this._service.getSongs();
      const h_resp = { status: 'success', data: { songs } };
      return h.response(h_resp).code(200);
    } catch (error) {
      // Server ERROR!
      console.error(error);
      const h_resp = { status: 'error', message: 'Maaf, terjadi kegagalan pada server kami.' };

      return h.response(h_resp).code(500);
    }
  }

  // Getting a song detail
  async getSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId);
      const h_resp = { status: 'success', data: { song } };
      return h.response(h_resp).code(200);
    } catch (error) {
      const h_resp = { status: '', message: '' };

      if (error.message === 'Lagu tidak ditemukan') {
        h_resp.status = 'fail';
        h_resp.message = error.message;
        return h.response(h_resp).code(404);
      }

      // Server ERROR!
      console.error(error);
      h_resp.status = 'error';
      h_resp.message = 'Maaf, terjadi kegagalan pada server kami.';

      return h.response(h_resp).code(500);
    }
  }

  // Updating an existing song
  async putSongByIdHandler(request, h) {
    try {
      const h_resp = { status: 'fail', message: '' };
      const validationResult = this._SongPayloadSchema.validate(request.payload);

      // if validation error
      if (validationResult.error) {
        // console.log(`Validation error: ${validationResult.error.message}`);
        h_resp.message = validationResult.error.message;
        return h.response(h_resp).code(400);
      }

      const { songId } = request.params;

      await this._service.editSongById(songId, request.payload);

      h_resp.status = 'success';
      h_resp.message = 'Lagu berhasil diperbarui';

      return h.response(h_resp).code(200);
    } catch (error) {
      const h_resp = { status: '', message: '' };

      if (error.message === 'Gagal memperbarui lagu. Id tidak ditemukan') {
        h_resp.status = 'fail';
        h_resp.message = error.message;
        return h.response(h_resp).code(404);
      }

      // Server ERROR!
      console.error(error);
      h_resp.status = 'error';
      h_resp.message = 'Maaf, terjadi kegagalan pada server kami.';

      return h.response(h_resp).code(500);
    }
  }

  // Deleting an existing song
  async deleteSongByIdHandler(request, h) {
    try {
      const { songId } = request.params;
      await this._service.deleteSongById(songId);
      const h_resp = { status: 'success', message: 'Lagu berhasil dihapus' };
      return h.response(h_resp).code(200);
    } catch (error) {
      const h_resp = { status: '', message: '' };

      if (error.message === 'Lagu gagal dihapus. Id tidak ditemukan') {
        h_resp.status = 'fail';
        h_resp.message = error.message;
        return h.response(h_resp).code(404);
      }

      // Server ERROR!
      console.error(error);
      h_resp.status = 'error';
      h_resp.message = 'Maaf, terjadi kegagalan pada server kami.';

      return h.response(h_resp).code(500);
    }
  }
}

module.exports = SongsHandler;
