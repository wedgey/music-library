const request = require("request-promise");
const moment = require("moment");

const { buildURL } = require("./queryBuilder");
const TaskManager = require("../../dataManagers/task");

// Get Info for a Youtube Video
exports.getVideoInfoById = async (id, part = "") => {
    if (!part) part = "contentDetails, snippet";
    let params = { id, part };
    let url = buildURL("videos", params);
    let response = await request({uri: url, json: true});
    return response && response.items.length > 0 ? response.items[0] : null;
}

// Get Info for a list of Youtube videos
exports.getManyVideoInfoByIds = async (ids, part ="") => {
    if (!part) part = "contentDetails, snippet";
    let params = { id: ids, part };
    let url = buildURL("videos", params);
    let response = await request({ uri: url, json: true });
    return response && response.items ? response.items : [];
}

// Get Info for a Channel by Id
exports.getChannelInfoById = async (id, part = "") => {
    if (!part) part = "contentDetails, snippet, statistics";
    let params = { id, part };
    let url = buildURL("channels", params);
    let response = await request({ uri: url, json: true });
    return response && response.items.length > 0 ? response.items[0] : null;
}

// Get Info for a channel by UserName
exports.getChannelInfoByUsername = async (username, part = "") => {
    if (!part) part = "contentDetails, snippet, statistics";
    let params = { forUsername: username, part };
    let url = buildURL("channels", params);
    let response = await request({ uri: url, json: true });
    return response && response.items.length > 0 ? response.items[0] : null;
}

// Get all the videos in a playlist
exports.getPlaylistVideosById = async (id, part = "", taskId = null) => {
    if (!part) part = "contentDetails,snippet,status";
    let params = { playlistId: id, part, maxResults: 50 };
    let url = buildURL("playlistItems", params);
    let response = await request({ uri: url, json: true });
    let result = null;

    if (taskId) await TaskManager.update(taskId, { message: "Retrieving videos from Youtube" });

    // For now, just keep making request until we get all videos and return everything. Look into using a pointer and make and ajax call again when the calling function is done with the current result set
    if (response) {
        result = response.items;
        let maxRequestCount = 500;
        let requestCount = 1;
        let nextPageToken = response.nextPageToken;
        while (nextPageToken && requestCount <= maxRequestCount) {
            params.pageToken = nextPageToken;
            url = buildURL("playlistItems", params);
            response = await request({ uri: url, json: true });
            if (response) {
                result = result.concat(response.items);
                nextPageToken = response.nextPageToken;
            } else {
                nextPageToken = undefined;
            }
            requestCount++;
            if (taskId) await TaskManager.update(taskId, { processed: result.length, total: response.pageInfo.totalResults });
            if (requestCount % 10) await new Promise((resolve, reject) => { setTimeout(() => resolve(), 1000) });
        }
    }
    return result;
}

// Convert youtube durations to seconds
exports.convertDurationToSeconds = (duration) => {
    return moment.duration(duration).asSeconds();
}