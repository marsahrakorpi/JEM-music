const http = require('http');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');

const ArtistsModel = require('./model/Artist');
const AlbumsModel = require('./model/Album');
const TracksModel = require('./model/Track');

mongoose.Promise = Promise;
var multi = false; //if need to do multiple back-to-back operations
var Artist = mongoose.model('Artist') || mongoose.model('Artist', ArtistsModel);
var Album = mongoose.model('Album') || mongoose.model('Album', AlbumsModel);
var Track = mongoose.model('Track') || mongoose.model('Track', TracksModel);
// admin:g/;7d:}~at-w`vD{
// master:2PzcYcJxK5S4BpGV
const mongoString = "mongodb://master:2PzcYcJxK5S4BpGV@ds125331.mlab.com:25331/serverless-ember"
const createErrorResponse = (statusCode, message) => ({
    statusCode: statusCode || 501,
    headers: { 'Content-Type': 'text/plain' },
    body: message || 'Incorrect id',
});

const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());
const dbExecuteMulti = (db, fn) => {
    new Promise(resolve => {
        db.then(fn).finally(resolve());
    }).then(db.close())
}
function dbConnectAndExecute(dbUrl, fn) {
    if(multi) return dbExecuteMulti(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
    else return dbExecute(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
}


module.exports.getAll = (event, context, callback) => {
    //convertFromMySQL(event, context, callback);

    multi = true;
    let tracksPromise = new Promise((resolve, reject) => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .find({})
                .then(tracks => {
                    let trackData = []
                    tracks.forEach(track => {
                        trackData.push(track)
                    })
                    let ret = { data: trackData }
                    resolve(ret)
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    });

    let albumsPromise = new Promise((resolve, reject) => {
        dbConnectAndExecute(mongoString, () => (
            Album
                .find({})
                .then(albums => {
                    let albumData = []
                    albums.forEach(album => {
                        albumData.push(album)
                    })
                    let ret = { data: albumData }
                    resolve(ret);
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })

    let artistsPromise = new Promise((resolve, reject) => {
        dbConnectAndExecute(mongoString, () => (
            Artist
                .find({})
                .then(artists => {
                    let artistData = []
                    artists.forEach(artist => {
                        artistData.push(artist)
                    })
                    let ret = { data: artistData }
                    resolve(ret)
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })

    Promise.all([tracksPromise, albumsPromise, artistsPromise])
        .then((data) => {
            multi=false;
            let tracksArr = [];
            let albumsArr = [];
            let artistsArr = [];
            new Promise(resolve => {
                data.forEach(dataArr => {
                    dataArr.data.forEach(d => {
                        if (d.type === 'artist') artistsArr.push(d);
                        if (d.type === 'album') albumsArr.push(d);
                        if (d.type === 'track') tracksArr.push(d);
                    })
                });
                resolve();
            }).then(() => {

                let p1 = new Promise(resolve => {
                    let retAlbums = albumsArr.map(album => {
                        album = album.toObject();
                        let findBy = album.attributes.artist;
                        //console.log(findBy);
    
                        let artist = artistsArr.find(item => item.id === findBy);
                        let relation = {
                            "artist": {
                                "data": {
                                    "type": "artist",
                                    "id": artist._id
                                }
                            }
                        }
                        album.relationships = relation
                        album.included = artist
                        return album;
                    })
                    resolve({data: retAlbums})
                })
                let p2 = new Promise(resolve => {
                    let retTracks = tracksArr.map(track => {
                        track = track.toObject();
                        let albumFindBy = track.attributes.album;
                        let artistFindBy = track.attributes.artist;

                        let album = albumsArr.find(item => item.id === albumFindBy);
                        let artist = artistsArr.find(item => item.id === artistFindBy);
                        let relation = {
                            "album": {
                                "data": {
                                    "type": "album",
                                    "id": album._id
                                }
                            },
                            "artist": {
                                "data":{
                                    "type": "artist",
                                    "id": artist._id
                                }
                            }
                        }

                        track.relationships = relation;
                        track.included = [album, artist];
                        return track;
                    })
                    resolve({data: retTracks});
                });
                let p3 = new Promise(resolve => {
                    resolve({data:artistsArr})
                })
                Promise.all([p1, p2, p3]).then(data => {
                    //console.log(data);
                    callback(null, { statusCode: 200, body: JSON.stringify(data) })
                })

                    .catch(err => {
                        callback(null, { statusCode: 501, body: JSON.stringify(err) })
                    })

            })

        })

}


module.exports.editTrack = (event, context, callback) => {
    let data=JSON.parse(event.body).data;
    let id = event.pathParameters.id;
    if (!validator.isAlphanumeric(event.pathParameters.id)) {
        callback(null, createErrorResponse(400, 'Incorrect id'));
        return;
      }
    let track = data.attributes;
    //get album and artist id
    let artistId = data.relationships.artist.data.id;
    let albumId = data.relationships.album.data.id;

    track.artist = artistId;
    track.album = albumId;
      console.log(id);

    let trackModel = new Track({
        _id : id,
        type: 'track',
        attributes: track
    })
    if (trackModel.validateSync()) {
        callback(null, createErrorResponse(400, 'Incorrect artist data:' + JSON.stringify(trackModel)));
        return;
    }

    dbConnectAndExecute(mongoString, () => (
        Track
            .findOneAndUpdate({"_id": id}, {attributes: track}, {upsert:true})
            .then((t) => {
                console.log(t);
                callback(null, { statusCode: 200, body: JSON.stringify({ data: trackModel })})
            })
            .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
    ));

}

module.exports.addTrack = (event, context, callback) => {
    let data = JSON.parse(event.body).data;
    //console.log(data);

    new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .find({}).sort({_id: -1}).collation({locale: "en_US", numericOrdering: true})
                .then((t) => {
                    let id = parseInt(t[0].id) + 1; //gets the biggest id it can find from mongo, then adds 1 to it
                    resolve(id);
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    }).then(id => {
        let album = data.relationships.album.data.id;
        let artist = data.relationships.artist.data.id;
        let attributes = data.attributes;
        attributes.album = album;
        attributes.artist = artist;

        let track = new Track({
            _id: id,
            type: 'track',
            attributes: attributes
        })
        if (track.validateSync()) {
            callback(null, createErrorResponse(400, 'Incorrect track data:' + JSON.stringify(track)));
        }
        multi=true;
        dbConnectAndExecute(mongoString,  (
            track
                .save()
                .then((t) => {
                    multi=false;
                    callback(null, { statusCode: 200, body: JSON.stringify({ data: track })})
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));

    })

}

module.exports.removeTrack = (event, context, callback) => {
    let id = event.pathParameters.id;
    
    new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .find({"_id": id})
                .then((t) => {
                    resolve(t); 
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    }).then(record => {
        record = record[0];
        delete(record.id)
        dbConnectAndExecute(mongoString, () => (
            Track
                .remove({"_id": id})
                .then(callback(null, { statusCode: 200, body: JSON.stringify({ data: record })}))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })


}

//************//
/* These convert functions */
/* are used to convert data */
/* over from MySQL to MongoDB */
//************//
function convertFromMySQL(event, context, callback) {
    //calls the old laravel backend for all the data
    http.get('http://localhost:8000/api/getAll', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            /*
            Enable the one you need, can only run one at a time
            */
            
            //convertArtists(data, callback);
            //convertAlbums(data, callback);
            //convertTracks(data, callback);

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}
function convertTracks(data, callback) {
    data = JSON.parse(data);

    let tracks = data.tracks;

    new Promise(resolve => {
        let trackArr = [];
        tracks.map(track => {
            let id = track.TrackId;
            delete (track.TrackId);
            delete (track.AlbumId);
            delete (track.ArtistId);
            track._id = id + '';

            let trackModel = new Track({

                _id: track._id,
                type: 'track',
                attributes: {
                    name: track.Name,
                    artist: track.Artist,
                    album: track.Album,
                    composer: track.Composer,
                    milliseconds: track.Milliseconds,
                    bytes: track.Bytes,
                    unitPrice: track.UnitPrice
                }

            })
            if (trackModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect artist data:' + JSON.stringify(trackModel)));
            } else {
                trackArr.push(trackModel);
            }

        }).then(resolve(trackArr))

    }).then(tracks => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .insertMany(tracks, { ordered: false })
                .then(() => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ tracks: tracks }),
                }))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })
}


function convertAlbums(data, callback) {
    data = JSON.parse(data);

    let albums = data.albums;

    new Promise((resolve) => {
        let albumArr = [];
        albums.map((album) => {
            let id = album.AlbumId;
            delete (album.AlbumId)
            delete (album.Name)
            album._id = id + '';

            let albumModel = new Album({
                _id: album._id,
                type: "album",
                attributes: {
                    title: album.Title,
                    artist: album.Artist
                }
            });

            if (albumModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect artist data:' + album));
            } else {
                albumArr.push(albumModel);
            }
        })
            .then(resolve(albumArr))
    })
        .then((albums) => {
            dbConnectAndExecute(mongoString, () => (
                Album
                    .insertMany(albums, { ordered: false })
                    .then(() => callback(null, {
                        statusCode: 200,
                        body: JSON.stringify({ artists: artists }),
                    }))
                    .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
            ));

        })

    callback(null, { statusCode: 200, body: JSON.stringify(albums) });
}

function convertArtists(data, callback) {

    data = JSON.parse(data);

    let artists = data.artists;

    new Promise((resolve, reject) => {
        let artistArr = [];

        artists.map(artist => {
            let id = artist.ArtistId;
            delete (artist.ArtistId)
            artist._id = id + '';

            let artistModel = new Artist({
                _id: artist._id,
                type: 'artist',
                attributes: {
                    name: artist.Name
                }
            });

            if (artistModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect artist data:' + artist));
            } else {
                artistArr.push(artistModel);
            }
        }).then(resolve(artistArr))

    }).then(artists => {
        dbConnectAndExecute(mongoString, () => (
            Artist
                .insertMany(artists, { ordered: false })
                .then(() => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ artists: artists }),
                }))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));

    })

}