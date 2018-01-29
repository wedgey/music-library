// Get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const { Status: StatusEnum, Type: TypeEnum } = require("../utils/enums").Task;

//==========================
// Task Schema
//==========================
const TaskSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: [TypeEnum.Sync],
        default: TypeEnum.Sync
    },
    message: String,
    description: String,
    progress: { 
        type: Number,
        default: 0
    },
    processed: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: [StatusEnum.Queued, StatusEnum.InProgress, StatusEnum.Completed, StatusEnum.Error],
        default: StatusEnum.Queued
    }
},
{
  timestamps: true
});

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Task', TaskSchema);