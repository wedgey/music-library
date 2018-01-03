const Song = require("../models/song");
const ArtistManager = require("./artist");
const YoutubeManager = require("../apiManagers/youtubeManager");

// Creates a song
exports.create = async function({title, artistNames, youtubeId, ownerId}) {
    let artists = await ArtistManager.getManyByNames(artistNames);
    if (artists && artists.length !== artistNames.length) {
        let newArtistNames = artistNames.filter(artistName => artists.findIndex(artist => artist.name === artistName) === -1);
        if (newArtistNames.length > 0) {
            artists = artists.concat(await Promise.all(newArtistNames.map(artistName => ArtistManager.create(artistName))));
        }
    }

    let existingSong = await Song.find({youtubeId}).exec();
    if (existingSong.length > 0) throw "Song already added.";

    let song = new Song({ 
        title, 
        artist: artists,
        youtubeId, 
        owner: ownerId
     });

    let youtubeVideo = await YoutubeManager.getVideoInfoById(youtubeId);
    if (youtubeVideo) {
        let { duration, dimension, definition, caption, licensedContent, projection } = youtubeVideo.contentDetails;
        let { title: ytTitle, description, channelId, channelTitle, categoryId, thumbnails, tags } = youtubeVideo.snippet;
        song.metadata = { duration: YoutubeManager.convertDurationToSeconds(duration), dimension, definition, caption, licensedContent, projection, title: ytTitle, description, channelId, thumbnails, channelTitle, tags, categoryId };
    }

    song.save();
    return song.populate('artist').execPopulate();
}

// Gets songs
exports.get = async function(queryObj = {}, projections = null, options = {}, populate = true) {
    let query = Song.find(queryObj, projections, options);
    if (populate) query = query.populate('artist');
    return query.exec();
}

// Get song count
exports.count = function(queryObj = {}) {
    return Song.count(queryObj).exec();
}