const ArtistManager = require("../dataManagers/artist");

// Gets artists
exports.get = function(req, res, next) {
    let { name } = req.query;
    let query = {};
    if (name) query.name = new RegExp('^'+name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), "i");
    ArtistManager.get(query)
        .then(artists => { return res.status(200).json({artists}); })
        .catch(err => { return next(err); });
}