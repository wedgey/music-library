const SongManager = require("../dataManagers/song");

const Token = require("../models/token");

// Creates a song
exports.create = function(req, res, next) {
    let title = req.body.title;
    let artist = typeof req.body.artist === "string" ? [req.body.artist] : req.body.artist;
    let youtubeId = req.body.youtubeId;

    SongManager.create({title, artistNames: artist, youtubeId, ownerId: req.user._id})
        .then(song => { return res.status(201).json({data: song}); })
        .catch(err => { return next(err); });
}

// Gets songs
exports.get = async function(req, res, next) {
    let query = {};
    if (req.query.id) query.id = req.query.id;
    if (req.query.title) query.title = new RegExp(req.query.title, 'i');
    let page = req.query.page ? parseInt(req.query.page) : 0;
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
    let options = { limit: pageSize, skip: page * pageSize };
    let totalCount = await SongManager.count(query);
    SongManager.get(query, null, options)
        .then(songs => { return res.status(200).json({data: songs, totalCount }); })
        .catch(err => { return next(err); });
}