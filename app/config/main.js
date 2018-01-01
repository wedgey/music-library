module.exports = {
    "port": process.env.PORT || 3001,
    "secret": process.env.KPOPLIBRARY_SECRET,
    "database": process.env.NODE_ENV === "production" ? "mongodb://127.0.0.1:27017/kpoplibrary" : "mongodb://kpoplibrary-db:27017/kpoplibrary",
    "expireInMilliseconds": 7 * 24 * 60 * 60 * 1000
}