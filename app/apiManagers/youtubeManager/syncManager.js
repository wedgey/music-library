const YoutubeManager = require("./index");
const Channel = require("../../models/channel");
const User = require("../../models/user");
const SongManager = require("../../dataManagers/song");
const TaskManager = require("../../dataManagers/task");

// Sync channel
exports.syncChannel = async (channelId) => {
    let systemUser = await User.findOne({ role: "System" }).exec();
    if (!systemUser) return;

    let channel = await Channel.findById(channelId).exec();
    if (!channel) return;

    let task = TaskManager.create({ owner: systemUser._id, status: TaskManager.TaskStatus.InProgress });

    let uploadsPlaylist = channel.uploadsPlaylist;
    let videos = await YoutubeManager.getPlaylistVideosById(uploadsPlaylist, "", task.id);
    if (!videos || videos.length === 0) return TaskManager.update(task.id, { message: "No Videos", status: TaskManager.TaskStatus.Completed });

    await TaskManager.update(task.id, { message: "Creating Songs...", processed: 0, total: videos.length });

    let prepVideos = videos.map(video => {
        return { title: video.snippet.title, youtubeId: video.contentDetails.videoId, ownerId: systemUser._id };
    });
    let newVideos = await SongManager.bulkCreate(prepVideos, false);

    await TaskManager.update(task.id, { message: "Sync Done.", processed: videos.length, status: TaskManager.TaskStatus.Completed });
}