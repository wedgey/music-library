const Artist = require("../models/artist");

const self = this;

// Creates an artist
exports.create = async function(name, type) {
    console.log(name);
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

// Gets or creates artists based on names
exports.getOrCreateByNames = async function(names = []) {
    let artists = names && names.length > 0 ? await this.getManyByNames(names) : [];
    if (artists && artists.length !== names.length) {
        let newArtistNames = names.filter(artistName => artists.findIndex(artist => artist.name === artistName) === -1);
        if (newArtistNames.length > 0) {
            let newArtists = await Promise.all(newArtistNames.map(artistName => this.create(artistName)));
            artists = await this.getManyByNames(names);
        }
    }
    return artists;
}