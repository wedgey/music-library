// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ThumbnailSchema = new Schema({
    url: String,
    width: Number,
    height: Number
},
{
    _id:  false
});

const SongMetaDataThumbnailsSchema = new Schema({
    default: ThumbnailSchema,
    medium: ThumbnailSchema,
    high: ThumbnailSchema,
    standard: ThumbnailSchema,
    maxres: ThumbnailSchema
},
{
    _id: false
})

const SongMetaDataSchema = new Schema({
    duration: Number,
    dimension: String,
    definition: String,
    caption: Boolean,
    licensedContent: Boolean,
    projection: String,
    title: String,
    description: String,
    channelId: String,
    channelTitle: String,
    categoryId: String,
    thumbnails: SongMetaDataThumbnailsSchema,
    tags: [String]
},
{
    _id: false
})

//==========================
// Song Schema
//==========================
const SongSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
        required: true
    },
    youtubeId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Deleted"],
        default: "Pending"
    },
    metadata: SongMetaDataSchema
},
{
  timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Song', SongSchema);