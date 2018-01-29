const Song = require("../models/song");
const ArtistManager = require("./artist");
const YoutubeManager = require("../apiManagers/youtubeManager");

// Creates a song
exports.create = async function({title, artistNames = [], youtubeId, ownerId}, populateResult = true) {
    let artists = artistNames && artistNames.length > 0 ? await ArtistManager.getManyByNames(artistNames) : [];
    if (artists && artists.length !== artistNames.length) {
        let newArtistNames = artistNames.filter(artistName => artists.findIndex(artist => artist.name === artistName) === -1);
        if (newArtistNames.length > 0) {
            let newArtists = await Promise.all(newArtistNames.map(artistName => ArtistManager.create(artistName)));
            artists = await ArtistManager.getManyByNames(artistNames);
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
    return populateResult ? song.populate('artist').execPopulate() : song;
}

// Bulk create songs
exports.bulkCreate = async function(songs, populateResult = true) {
    // Create Artist Dictionary
    let artistNames = songs.map(song => song.artistNames).reduce((arr, artistNames) => {
        arr.concat(artistNames)
        return arr;
    }, []);
    artistNames = [...new Set(artistNames)];
    let artists = await ArtistManager.getOrCreateByNames(artistNames);
    artists = artists.reduce((obj, artist) => {
        obj[artist.name] = artist;
        return obj;
    }, {});

    // Create Existing Song Dictionary
    let youtubeIds = songs.map(song => song.youtubeId);
    let existingSongs = await Song.find({youtubeId: { $in: youtubeIds } }).exec();
    existingSongs = existingSongs.reduce((obj, song) => {
        obj[song.youtubeId] = song;
        return obj;
    }, {});

    // Create New Song Objects
    let newSongs = [];
    songs.forEach((song, index) => {
        if (!existingSongs[song.youtubeId]) {
            let newSong = new Song({ title: song.title, youtubeId: song.youtubeId, owner: song.ownerId });
            if (song.artistNames) newSong.artist = song.artistNames.map(a => artists[a]);
            newSongs.push(newSong);
        }
    });
    
    // Create Youtube Info Object
    let maxYTResults = 50;
    let youtubeVideoInfos = [];
    for (var i = 0; i < newSongs.length; i = i + maxYTResults) {
        let tempVids = newSongs.slice(i, i + maxYTResults);
        let tempVidIds = tempVids.map(vid => vid.youtubeId).join(",");
        let vids = await YoutubeManager.getManyVideoInfoByIds(tempVidIds);
        if (vids) youtubeVideoInfos = youtubeVideoInfos.concat(vids);
        if (i % 500) await new Promise((resolve, reject) => { setTimeout(() => resolve(), 1000) });
    }
    youtubeVideoInfos = youtubeVideoInfos.reduce((obj, vid) => {
        obj[vid.id] = vid;
        return obj;
    }, {});

    // Populate New Songs with metadata
    newSongs.forEach((song, index) => {
        let youtubeVideo = youtubeVideoInfos[song.youtubeId];
        if (youtubeVideo) {
            let { duration, dimension, definition, caption, licensedContent, projection } = youtubeVideo.contentDetails;
            let { title: ytTitle, description, channelId, channelTitle, categoryId, thumbnails, tags } = youtubeVideo.snippet;
            song.metadata = { duration: YoutubeManager.convertDurationToSeconds(duration), dimension, definition, caption, licensedContent, projection, title: ytTitle, description, channelId, thumbnails, channelTitle, tags, categoryId };
        }
    });

    return Song.insertMany(newSongs);
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

// Update song status
exports.updateStatus = function(id, status) {
    return Song.findByIdAndUpdate(id, { status: status }).exec();
}

// Update song name
exports.updateTitle = function(id, title) {
    if (id === undefined || title === undefined) throw new Error("No id or title supplied.");
    return Song.findByIdAndUpdate(id, { title: title }).exec();
}

// Update song artist
exports.updateArtist = async function(id, artistNames) {
    let artists = await ArtistManager.getOrCreateByNames(artistNames);
    return Song.findByIdAndUpdate(id, { artist: artists }, { new: true }).populate('artist').exec();
}