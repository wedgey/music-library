// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const Config = require("../config/main");

//==========================
// Token Schema
//==========================
const TokenSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['PasswordReset', 'TokenRefresh', 'EmailConfirmation', 'General'],
        default: 'General'
    },
    expirationDate: {
        type: Date,
        default: () => +new Date() + Config.expireInMilliseconds
    }
},
{
  timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Token', TokenSchema);