const SongManager = require("../dataManagers/song");

// Creates a song
exports.create = function(req, res, next) {
    let title = req.body.title;
    let artist = req.body.artist;
    let youtubeId = req.body.youtubeId;

    SongManager.create({title, artistName: artist, youtubeId, ownerId: req.user._id})
        .then(song => { return res.status(201).json({data: song}); })
        .catch(err => { return next(err); });
}

// Gets songs
exports.get = function(req, res, next) {
    SongManager.get()
        .then(songs => { return res.status(200).json({data: songs}); })
        .catch(err => { return next(err); });
}