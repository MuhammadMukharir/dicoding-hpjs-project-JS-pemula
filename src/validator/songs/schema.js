const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1900).max(2021).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().min(0).max(1000).required(),
});

module.exports = { SongPayloadSchema };
