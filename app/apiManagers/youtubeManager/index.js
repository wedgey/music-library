const request = require("request-promise");
const moment = require("moment");

const { buildURL } = require("./queryBuilder");

exports.getVideoInfoById = async (id, part = "") => {
    if (!part) part = "contentDetails, snippet";
    let params = { id, part };
    let url = buildURL("videos", params);
    let response = await request({uri: url, json: true});
    return response && response.items.length > 0 ? response.items[0] : null;
}

exports.convertDurationToSeconds = (duration) => {
    return moment.duration(duration).asSeconds();
}