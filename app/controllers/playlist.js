const PlaylistManager = require("../dataManagers/playlist");

// Creates a playlist
exports.create = function(req, res, next) {
    let owner = req.user._id;
    let name = req.body.name;
    let songs = req.body.songs;

    PlaylistManager.create({name, owner, songs})
        .then(async (playlist) => { return res.status(201).json(await PlaylistManager.populatePlaylist(playlist)); })
        .catch(err => { return next(err); });
}

// Get playlists
exports.get = function(req, res, next) {
    let owner = req.user._id;
    PlaylistManager.get({owner})
        .then(async playlists => { 
            let result = await Promise.all(playlists.map(async playlist => await PlaylistManager.populatePlaylist(playlist)));
            return res.status(201).json(result);
        })
        .catch(err => { return next(err); });
}

// Delete a playlist
exports.delete = function(req, res, next) {
    let ownerId = req.user._id;
    let id = req.query.id;
    PlaylistManager.delete({id, ownerId})
        .then(() => { return res.sendStatus(200) })
        .catch(err => { return next(err); })
}

// Add a song to a playlist
exports.addSongToPlaylist = function(req, res, next) {
    let ownerId = req.user._id;
    let { id, songId } = req.body;
    PlaylistManager.addSongToPlaylist({id, ownerId, songId})
        .then(() => { return res.sendStatus(200)} )
        .catch(err => { return next(err); });
}

// Remove a song from a playlist
exports.removeSongFromPlaylist = function(req, res, next) {
    let ownerId = req.user._id;
    let { id, songId } = req.body;
    PlaylistManager.removeSongFromPlaylist({id, ownerId, songId})
        .then(() => { return res.sendStatus(200)} )
        .catch(err => { return next(err) });
}

// Renames a playlist
exports.renamePlaylist = function(req, res, next) {
    let ownerId = req.user._id;
    let { id, name } = req.body;
    PlaylistManager.renamePlaylist({id, ownerId, name})
        .then(() => { return res.sendStatus(200) })
        .catch(err => { return next(err) });
}