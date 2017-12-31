module.exports = {
    "port": process.env.PORT || 3001,
    "secret": process.env.KPOPLIBRARY_SECRET,
    "database": "mongodb://kpoplibrary-db:27017/kpoplibrary",
    "expireInMilliseconds": 7 * 24 * 60 * 60 * 1000
}