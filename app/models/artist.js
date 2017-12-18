// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//==========================
// Artist Schema
//==========================
const ArtistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Group', 'Solo'],
        default: 'Group'
    }
},
{
  timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Artist', ArtistSchema);