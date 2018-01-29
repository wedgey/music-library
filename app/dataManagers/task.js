const Task = require("../models/task");
const { Status: StatusEnum } = require("../utils/enums").Task

exports.TaskStatus = StatusEnum;

// Create a task
exports.create = function({ owner, type, status, processed, total }) {
    let task = new Task({
        owner,
        type,
        status,
        processed,
        total
    });

    task.save();
    return task;
}

// Update a task
exports.update = async function(id, { message, status, processed, total }) {
    let task = await Task.findById(id).exec();
    if (task) {
        if (status) task.status = status;
        if (processed !== undefined) task.processed = parseInt(processed);
        if (total !== undefined) task.total = parseInt(total);
        task.progress = task.processed / (task.total || 1);
        await task.save();
        return task;
    }
    return false;
}