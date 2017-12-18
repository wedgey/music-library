const BASE_URL = "https://www.googleapis.com/youtube/v3/";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const createParams = (params) => {
    let paramsArray = Object.entries(params).map(param => `${param[0]}=${param[1]}`);
    let keyParam = paramsArray.length > 0 ? `key=${YOUTUBE_API_KEY}&` : `key=${YOUTUBE_API_KEY}`;
    return `?${keyParam}${paramsArray.join('&')}`;
}

exports.buildURL = (resource, params) => {
    let paramsString = createParams(params);
    return `${BASE_URL}${resource}${paramsString}`;
}