const request = require('request');
const qs = require('querystring');
const jwt = require('jsonwebtoken');

function similar(a,b) {
    //compares the similarity of two strings
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }

    var weight = equivalency / maxLength;
    return weight
}

module.exports.search = (event, context, callback) => {
    let token = event.headers.Authorization.toString().substr(7);
    let decodedJWT = "";
    jwt.verify(token, 'superSecretSecret', function(err, decoded) {
        if (err) {
            callback(null, {statusCode: 401, body:"Invalid access token"});
        } else {
            decodedJWT = decoded;
            if(!decodedJWT.spotifyToken) callback(null, {statusCode: 501, body:"No Spotify Access Token Found For User"});
        }
    });
    let data = qs.parse(decodeURIComponent(event.body));

    let track = data.track;
    let album = data.album;
    let artist = data.artist;

    if(!data.type) callback(null, {statusCode: 400, body:"Request had no type parameter."})
    let type = data.type;
    let q = "";

    if(type === "track") q = data.track;
    else if(type === "album") q = data.album;
    else if(type === "artist") q = data.artist;
    else callback(null, {statusCode: 400, body:"Request had an incorrect type parameter. Accepted types are: track, album, artist"})

    let queryString = "?q="+q+"&type="+type+"&offset=0&limit=5";
   // console.log(queryString);

    let spotifyToken = decodedJWT.spotifyToken;


    searchSpotify(queryString, spotifyToken, callback).then(res => {
        let items = "";
        res = JSON.parse(res);

        if(type === "track") items = res.tracks;
        else if (type === "album") items = res.albums;
        else if (type === "artist") items = res.artists;
        if(items === "") callback(null, {statusCode: 501, body:"Searching Spotify did not return items"})
        let itemsArr = items.items;

        let bestMatch = "";
        let bestSimilarity = 0;
        itemsArr.forEach(item => {
            //Set the types here
            if(album && item.album){
                //console.log("searched for: "+album+" Found: "+item.album.name);
                let similarity = similar(album,item.album.name);
                if(similarity>bestSimilarity && similarity>0.25){ 
                    bestSimilarity = similarity;
                    bestMatch = item.preview_url;
                }
            }
        })
       // console.log("searched for: "+album+" Found: "+bestMatch+" With a similarity of: "+bestSimilarity);
        callback(null, {statusCode: 200, body: JSON.stringify({url: bestMatch})});
    });

}

function searchSpotify(queryString, spotifyToken) {
    return new Promise(resolve => {
        request.get('https://api.spotify.com/v1/search'+queryString, {
            auth: {
                'bearer': spotifyToken
            }
        }, function(error, response, body) {
            resolve(body);
        });
    })

}

