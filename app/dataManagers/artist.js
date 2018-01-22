const Artist = require("../models/artist");

// Creates an artist
exports.create = async function(name, type) {
    let artist = new Artist({name, type});
    return artist.save();
}

// Gets artists
exports.get = async function(queryObj = {}) {
    let query = Artist.find(queryObj);
    return query.exec();
}

exports.getOneByName = async function(name = "") {
    return Artist.findOne({name}).exec();
}

exports.getManyByNames = function(names = []) {
    return Artist.aggregate()
                    .match({ name: {$in: names} })
                    .addFields({ __order: {$indexOfArray: [names, "$name"]}})
                    .sort({ __order: 1})
                    .exec();
}