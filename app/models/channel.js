// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ThumbnailSchema = new Schema({
    url: String
},
{
    _id:  false
});

const ChannelThumbnailsSchema = new Schema({
    default: ThumbnailSchema,
    medium: ThumbnailSchema,
    high: ThumbnailSchema,
    standard: ThumbnailSchema,
    maxres: ThumbnailSchema
},
{
    _id: false
})

//==========================
// Channel Schema
//==========================
const ChannelSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    youtubeId: {
        type: String,
        required: true,
        unique: true
    },
    youtubeUsername: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    customUrl: {
        type: String
    },
    uploadsPlaylist: {
        type: String
    },
    thumbnails: ChannelThumbnailsSchema
}, {
    timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Channel', ChannelSchema);