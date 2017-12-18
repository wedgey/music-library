// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//==========================
// Artist Schema
//==========================
const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
    type: {
        type: String,
        enum: ['Private', 'Shared', 'System'],
        default: 'Private'
    }
},
{
  timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Playlist', PlaylistSchema);