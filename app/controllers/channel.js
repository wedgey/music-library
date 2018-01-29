const ChannelManager = require("../dataManagers/channel");
const SyncManager = require("../apiManagers/youtubeManager/syncManager");

// Create a channel
exports.create = function(req, res, next) {
    let youtubeUsername = req.body.youtubeUsername;

    ChannelManager.create({ youtubeUsername, ownerId: req.user._id })
                    .then(channel => { return res.status(201).json(channel); })
                    .catch(err => { return next(err); });
}

// Get Channels
exports.get = function(req, res, next) {
    ChannelManager.get()
                    .then(channels => { return res.status(200).json(channels); })
                    .catch(err => { return next(err); });
}

// Sync Channel
exports.sync = function(req, res, next) {
    let channelId = req.body.id;
    let userId = req.user.id;
    SyncManager.syncChannel(channelId, userId);    
    return res.status(204).send();
}