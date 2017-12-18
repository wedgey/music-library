const Song = require("../models/song");
const ArtistManager = require("./artist");
const YoutubeManager = require("../apiManagers/youtubeManager");

// Creates a song
exports.create = async function({title, artistName, youtubeId, ownerId}) {
    let artist = await ArtistManager.getOneByName(artistName);
    if (!artist) artist = await ArtistManager.create(artistName);

    let existingSong = await Song.find({youtubeId}).exec();
    if (existingSong.length > 0) throw "Song already added.";

    let song = new Song({ 
        title, 
        artist: artist._id,
        youtubeId, 
        owner: ownerId
     });

    let youtubeVideo = await YoutubeManager.getVideoInfoById(youtubeId);
    if (youtubeVideo) {
        let { duration, dimension, definition, caption, licensedContent, projection } = youtubeVideo.contentDetails;
        let { title: ytTitle, description, channelId, channelTitle, categoryId, thumbnails, tags } = youtubeVideo.snippet;
        song.metadata = { duration: YoutubeManager.convertDurationToSeconds(duration), dimension, definition, caption, licensedContent, projection, title: ytTitle, description, channelId, thumbnails, channelTitle, tags, categoryId };
    }

    return song.save();
}

// Gets songs
exports.get = async function(queryObj = {}, populate = true) {
    let query = Song.find(queryObj);
    if (populate) query = query.populate('artist');
    return query.exec();
}