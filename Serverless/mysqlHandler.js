const mysql = require('mysql');
const http = require('http');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');

const ArtistsModel = require('./model/Artist');
const AlbumsModel = require('./model/Album');
const TracksModel = require('./model/Track');
const GenresModel = require('./model/Genre');
const MediaTypesModel = require('./model/MediaType');

mongoose.Promise = Promise;

var multi = false; //if need to do multiple back-to-back operations
var MediaType = mongoose.model('MediaType') || mongoose.model('MediaType', MediaTypesModel);
var Genre = mongoose.model('Genre') || mongoose.model('Genre', GenresModel);
var Artist = mongoose.model('Artist') || mongoose.model('Artist', ArtistsModel);
var Album = mongoose.model('Album') || mongoose.model('Album', AlbumsModel);
var Track = mongoose.model('Track') || mongoose.model('Track', TracksModel);

// mongoadmin:6jaRpVnx8YGz9vYn
const mongoString = "mongodb://mongoadmin:6jaRpVnx8YGz9vYn@ds127391.mlab.com:27391/items"
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


module.exports.mysql = (event, context, callback) => {

    /*dbConnectAndExecute(mongoString, () => (
        Artist
            .find()
            .then(track => console.log(track))
            .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
    ));

    callback(null, { statusCode: 501, body: "sssss" });
    return; */


    //convertArtists(callback);
    //convertAlbums(callback);
    //convertGenres(callback);
    //convertMediaTypes(callback);
    //convertTracks(callback);
    
    multi=true;
    let albums = new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Album
                .find()
                .then(albums => resolve(albums))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })  

    let tracks = new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .find()
                .then(tracks => resolve(tracks))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })
    multi=false;
    Promise.all([tracks, albums])
    .then(data => {
        let tracks = data[0];
        let albums = data[1];
        let itemArr = [];

        let mappedAlbums = albums.map(album => {
            
            let filteredTracks = tracks.filter(track => track.relationships.album.data.id == album.id)
            //if(album.id === "5d0f736ff0acd35bf41f8a9a") console.log(filteredTracks);
            let relationshipTracks = filteredTracks.map(f => {
                return {type:"tracks", id:f.id}
            })
            //if(album.id === "5d0f736ff0acd35bf41f8a9a") console.log(relationshipTracks);
            album=album.toObject()

            album.relationships.tracks = {data: relationshipTracks};
            //if(album.id === "5d0f736ff0acd35bf41f8a9a") console.log(album);
            
            let albumModel = new Album(album);

            if (albumModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect artist data:' + album));
            } else {
                return albumModel;
            }
        })

        let item = mappedAlbums.find(a => a.id === "5d0f736ff0acd35bf41f8a9a");
        let itemb = mappedAlbums.find(a => a.id === "5d0f736ff0acd35bf41f8a9b");
        let items = [];
        multi=true;
        new Promise(resolve => {
            mappedAlbums.forEach(album => {
            
                let id = album._id;
                console.log("Updating album: ", id);
                delete(album._id);
                console.log(album);
                dbConnectAndExecute(mongoString, () => (
                    Album
                        .findByIdAndUpdate(id, album)
                        .then((g) => console.log("done"))
                        .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
                ));
                         
            })
            resolve()
        }).then(callback(null, {statusCode:200, body:"ok"}))


    })
   


}

function convertMediaTypes(callback){
    let genres = new Promise(resolve => {
        //get albums from mysql
        var connection = mysql.createConnection({
            host     : 'mysql-test2.cryajph31jpg.eu-west-3.rds.amazonaws.com',
            user     : 'admin',
            password : 'DdHAubkHdfTd2enh',
            database : 'Chinook'
        });
    
        connection.connect();
    
        let query = "SELECT * FROM MediaType";

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            resolve(results)
        })
    }).then(mediaTypes => {
        let m = mediaTypes.map(mediaType => {

            let model = new MediaType({
                type: 'mediaTypes',
                attributes: {
                    mediaTypeId : mediaType.MediaTypeId,
                    name : mediaType.Name
                }
            });
            if (model.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect model data:' + model));
            } else {
                return(model);
            }
        })
        dbConnectAndExecute(mongoString, () => (
            MediaType
                .insertMany(m, { ordered: false })
                .then(() => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ items: g }),
                }))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
        callback(null, { statusCode: 200, body: "ok" })

    })
}


function convertGenres(callback){
    let genres = new Promise(resolve => {
        //get albums from mysql
        var connection = mysql.createConnection({
            host     : 'mysql-test2.cryajph31jpg.eu-west-3.rds.amazonaws.com',
            user     : 'admin',
            password : 'DdHAubkHdfTd2enh',
            database : 'Chinook'
        });
    
        connection.connect();
    
        let query = "SELECT * FROM Genre";

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            resolve(results)
        })
    }).then(genres => {
        let g = genres.map(genre => {

            let model = new Genre({
                type: 'genres',
                attributes: {
                    genreId : genre.GenreId,
                    name : genre.Name
                }
            });
            if (model.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect model data:' + model));
            } else {
                return(model);
            }
        })
        dbConnectAndExecute(mongoString, () => (
            Genre
                .insertMany(g, { ordered: false })
                .then(() => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ items: g }),
                }))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
        callback(null, { statusCode: 200, body: "ok" })

    })
}

function convertTracks(callback){
    multi=true;
    let artistsArr = [];
    let albumsArr = [];
    let mediaTypesArr = [];
    let genresArr = [];
    let tracksArr = [];
    //get artists from monkko deebee
    let artists = new Promise((resolve,reject) => {
        dbConnectAndExecute(mongoString, () => (
            Artist
                .find()
                .then(artists => {console.log("artists"); artistsArr = artists; resolve(artistsArr)})
                .catch(err => reject(err))
        ));
    })
    let albums = new Promise((resolve,reject) => {
        dbConnectAndExecute(mongoString, () => (
            Album
                .find()
                .then(albums => {console.log("albums");albumsArr = albums; resolve(albumsArr)})
                .catch(err => reject(err))
        ));
    })
    let mediaTypes = new Promise((resolve,reject) => {
        dbConnectAndExecute(mongoString, () => (
            MediaType
                .find()
                .then(mediaTypes => {console.log("mediatypes");mediaTypesArr = mediaTypes; resolve(mediaTypesArr)})
                .catch(err => reject(err))
        ));
    })
    let genres = new Promise((resolve,reject) => {
        dbConnectAndExecute(mongoString, () => (
            Genre
                .find()
                .then(genres => {console.log("genres");genresArr = genres; resolve(genresArr)})
                .catch(err => reject(err))
        ));
    })

    let tracks = new Promise(resolve => {
        //get albums from mysql
        var connection = mysql.createConnection({
            host     : 'mysql-test2.cryajph31jpg.eu-west-3.rds.amazonaws.com',
            user     : 'admin',
            password : 'DdHAubkHdfTd2enh',
            database : 'Chinook'
        });
    
        connection.connect();
    
        let query = "SELECT * FROM Track";

        connection.query(query, function (error, results, fields) {
            if (error) reject(error);
            tracksArr = results;
            resolve(albumsArr);
        })
    })

    Promise.all(artists, albums, tracks, genres, mediaTypes)
    .then(() => {
        console.log(albumsArr);
        let t = tracksArr.map(track => {

            //mongo objectids
            let album = albumsArr.find(album => album.attributes.albumId === track.AlbumId.toString());
            let genre = genresArr.find(genre => genre.attributes.genreId === track.GenreId.toString());
            let mediaType = mediaTypesArr.find(mediaType => mediaType.attributes.mediaTypeId === track.MediaTypeId.toString());

            let albumId = album._id;
            let genreId = genre._id;
            let mediaTypeId = mediaType._id;

            let trackModel = new Track({
                type: "tracks",
                attributes: {
                    name: track.Name,
                    composer: track.Composer,
                    milliseconds: track.Milliseconds,
                    bytes: track.Bytes,
                    unitPrice: track.UnitPrice
                },
                relationships:{
                    album: {
                        data:{
                            id: albumId,
                            type: "albums"
                        }
                    },
                    genre: {
                        data:{
                            id: genreId,
                            type: "genres"
                        }
                    },
                    mediaType: {
                        data:{
                            id: mediaTypeId,
                            type: "mediaTypes"
                        }
                    }
                }
            });

            if (trackModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect model data:' + trackModel));
            } else {
                return(trackModel);
            }
        })

        console.log("complete", t);
        console.log("Trying to insert into mongo.....")
        multi=false;
        dbConnectAndExecute(mongoString, () => (
            Track
                .insertMany(t, { ordered: false })
                .then((items) => {
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify({ items: items }),
                    })
                })
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ))
    }).catch(err => {
        callback(null, createErrorResponse(err.statusCode, err.message))
    })
}

function convertAlbums(callback){
    let artistsArr = [];
    let albumsArr = [];
    //get artists from monkko deebee
    multi=true;
    let artists = new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Artist
                .find()
                .then(artists => {artistsArr = artists; resolve(artistsArr)})
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })  

    let tracks = new Promise(resolve => {
        dbConnectAndExecute(mongoString, () => (
            Track
                .find()
                .then(tracks => {tracksArr = tracks; resolve(tracksArr)})
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
    })
       
    let albums = new Promise(resolve => {
        //get albums from mysql
        var connection = mysql.createConnection({
            host     : 'mysql-test2.cryajph31jpg.eu-west-3.rds.amazonaws.com',
            user     : 'admin',
            password : 'DdHAubkHdfTd2enh',
            database : 'Chinook'
        });
    
        connection.connect();
    
        let query = "SELECT * FROM Album";

        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            albums = results.map(res => {
                return res;
            })
            albumsArr = albums;
            resolve(albumsArr);
        })
    })

    multi=false;
    Promise.all([artists, tracks, albums])
    .then(() => {

        let itemArr = [];

        albumsArr.forEach(album => {

            let artist = artistsArr.find(artist => artist.attributes.artistId === album.ArtistId.toString());
            //let tracks = tracksArr.filter(track => track.relationships.album.data.id === album.AlbumId);
            //console.log(tracks);
            let albumArtist = artist._id;

            let albumModel = new Album({
                type: "albums",
                attributes: {
                    title: album.Title,
                    albumId: album.AlbumId
                },
                relationships:{
                    artist: {
                        data:{
                            id: albumArtist,
                            type: "artists"
                        }
                    }
                }
            });
            if (albumModel.validateSync()) {
                callback(null, createErrorResponse(400, 'Incorrect artist data:' + album));
            } else {
                itemArr.push(albumModel);
            }
        })
        multi=false;
        new Promise(resolve => {
            console.log("insert into mongo")
            dbConnectAndExecute(mongoString, () => (
                Album
                    .insertMany(itemArr, { ordered: false })
                    .then((items) => {
                        resolve(items);
    
                    })
                    .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
            ))
        })
        .then((items) => {
            multi=false;
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ items: items }),
            })
        });
    })

}

function convertArtists(callback){

    var connection = mysql.createConnection({
        host     : 'mysql-test2.cryajph31jpg.eu-west-3.rds.amazonaws.com',
        user     : 'admin',
        password : 'DdHAubkHdfTd2enh',
        database : 'Chinook'
    });

    connection.connect();
    let itemArr=[];
    let query = "SELECT * FROM Artist";
    new Promise(resolve => {
        connection.query(query, function (error, results, fields) {
            if (error) throw error;
            
            results.forEach(res => {

                let model = new Artist({
                    type: 'artists',
                    attributes: {
                        artistId : res.ArtistId,
                        name : res.Name
                    }
                });
                if (model.validateSync()) {
                    callback(null, createErrorResponse(400, 'Incorrect model data:' + model));
                } else {
                    itemArr.push(model);
                }
            })
            resolve(itemArr);
    
        });
    }).then((items) => {

        dbConnectAndExecute(mongoString, () => (
            Artist
                .insertMany(items, { ordered: false })
                .then(() => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ items: items }),
                }))
                .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));
        callback(null, { statusCode: 200, body: "ok" })
    }).catch(() => {
        callback(null, { statusCode: 501, body: "not very ok" })
    }).finally(() => {
        connection.end();
    })
}
/*

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
*/