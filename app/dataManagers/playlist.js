const mongoose = require('mongoose');

const Playlist = require("../models/playlist");
const SongManager = require("./song");

// Create a playlist
exports.create = function({name, owner, songs}) {
    let playlist = new Playlist({name, owner, songs});
    return playlist.save();
}

// Get playlists
exports.get = async function(queryObj = {}) {
    let query = Playlist.find(queryObj);
    return query.exec();
}

// Delete a playlist
exports.delete = function({id, ownerId}) {
    return Playlist.deleteOne({ _id: id, owner: ownerId }).exec();
}

// Adds a song to a playlist
exports.addSongToPlaylist = async function({id, ownerId, songId}) {
    let song = await SongManager.get({_id: songId});
    if (song.length <= 0) throw "Song not found";
    return Playlist.updateOne({ _id: id, owner: ownerId }, { $push: { songs: song[0] }});
}

// Removes a song from a playlist
exports.removeSongFromPlaylist = async function({id, ownerId, songId}) {
    return Playlist.updateOne({ _id: id, owner: ownerId }, { $pull: { songs: songId }});
}

exports.renamePlaylist = async function({id, ownerId, name}) {
    return Playlist.updateOne({ _id: id, owner: ownerId }, { $set: { name: name }});
}

// Populates a playlist
exports.populatePlaylist = async function(playlist) {
    let result = await playlist.populate({ path: 'songs', populate: { path: 'artist' }}).execPopulate();
    return result;
}