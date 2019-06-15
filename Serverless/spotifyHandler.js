var SPOTIFY_KEY="40e7cf37f399406796151cd92509230b";
var SPOTIFY_SECRET="2d11fc4ab38547739b14d8ce0b51a86e";
var request = require('request');

module.exports.authenticate = (event, context, callback) => {

    // your application requests authorization
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(SPOTIFY_KEY + ':' + SPOTIFY_SECRET).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };
    
    request.post(authOptions, function(error, response, body) {
        if(error) callback(null, { statusCode: 501, body: "Spotify Authentication failed" })
        if (!error && response.statusCode === 200) {
    
        // use the access token to access the Spotify Web API
        var token = body.access_token;
        callback(null, { statusCode: 200, body: token })
        }
    });


}