const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  // k5: create new playlist
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // k6: get list of my playlist
  async getPlaylists(credentialId) {
    const query = {
      text: `SELECT DISTINCT playlists.id, playlists.name, users.username
      FROM playlists 
      LEFT JOIN collaborations 
        ON collaborations.playlist_id = playlists.id
      LEFT JOIN users 
        ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [credentialId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  // k7: delete playlist
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  // k8: add song to playlist
  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    // delete playlist-cache in redis
    await this._cacheService.delete(`playlist:${playlistId}`);

    return result.rows[0].id;
  }

  // k9: songs in playlist
  async getSongsFromPlaylistById(id) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`playlist:${id}`);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan catatan dari database
      const query = {
        text: 'SELECT songs.id, title, performer FROM songs INNER JOIN playlistsongs ON playlistsongs.song_id=songs.id WHERE playlistsongs.playlist_id = $1',
        values: [id],
      };
      const result = await this._pool.query(query);

      // informasi playlist akan disimpan pada cache sebelum fungsi getSongsFromPlaylistById dikembalikan
      await this._cacheService.set(`playlist:${id}`, JSON.stringify(result));

      return result.rows;
    }
  }

  // k10: delete song from playlist
  async deleteSongFromPlaylistById(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE (song_id = $1 AND playlist_id = $2)  RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }

    // delete playlist-cache in redis
    await this._cacheService.delete(`playlist:${playlistId}`);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
