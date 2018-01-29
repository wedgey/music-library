const Channel = require("../models/channel");
const YoutubeManager = require("../apiManagers/youtubeManager");

// Creates a channel object
exports.create = async function({ youtubeUsername, ownerId }) {
    let channel = await Channel.findOne({ youtubeUsername }).exec();
    if (channel) return channel;

    let youtubeChannel = await YoutubeManager.getChannelInfoByUsername(youtubeUsername);
    if (!youtubeChannel) return null;

    let { title, description, customUrl, thumbnails } = youtubeChannel.snippet;
    channel = new Channel({
        owner: ownerId,
        title,
        youtubeId: youtubeChannel.id,
        youtubeUsername: youtubeUsername,
        description,
        customUrl,
        uploadsPlaylist: youtubeChannel.contentDetails.relatedPlaylists.uploads,
        thumbnails
    });

    channel.save();
    return channel;
}

// Get Channels
exports.get = async function(queryObj = {}, projections = null, options = {}, populate = true) {
    let query = Channel.find(queryObj, projections, options);
    return query.exec();
}