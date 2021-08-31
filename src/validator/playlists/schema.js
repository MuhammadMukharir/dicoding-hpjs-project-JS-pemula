const Joi = require('joi');

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().pattern(/^song-/).required(),
});

const DeleteSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().pattern(/^song-/).required(),
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
  DeleteSongToPlaylistPayloadSchema,
};
