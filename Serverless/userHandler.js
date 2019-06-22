const mongoose = require('mongoose');
const Promise = require('bluebird');
const validator = require('validator');
const qs = require('querystring');
var jwt = require('jsonwebtoken');
var request = require('request');

var UserModel = require('./model/User');

var User = mongoose.model('User') || mongoose.model('User', UserModel);

mongoose.Promise = Promise;

const bcrypt = require('bcrypt');
const saltRounds = 10;

//const mongoString = 'mongodb://development:H0yeXSLFynEct39D@testanddev-shard-00-00-l8ijy.mongodb.net:27017,testanddev-shard-00-01-l8ijy.mongodb.net:27017,testanddev-shard-00-02-l8ijy.mongodb.net:27017/next?ssl=true&replicaSet=testanddev-shard-0&authSource=admin'
const mongoString = "mongodb://master:2PzcYcJxK5S4BpGV@ds125331.mlab.com:25331/serverless-ember"
const createErrorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect id',
});
const dbExecute = (db, fn) => db.then(fn).finally(() => db.close());
/*
var dbExecute = (db, fn) => { 
  new Promise(resolve => {
      db.then(fn);
  }).then(db.close())
}*/
function dbConnectAndExecute(dbUrl, fn) {
  return dbExecute(mongoose.connect(dbUrl, { useMongoClient: true }), fn);
}


function getSpotifyToken(){


}

module.exports.login = (event, context, callback) => {

  let data = qs.parse(decodeURIComponent(event.body));

  if(data.grant_type != "password") callback(null, createErrorResponse(401, "Invalid grant_type"))
  if(!data.grant_type) callback(null, createErrorResponse(401, "Request is missing grant_type"))
  if(!data.username) callback(null, createErrorResponse(401, "Request is missing username"))
  if(!data.password) callback(null, createErrorResponse(401, "Requesti is missing password"))

  if (!validator.isEmail(data.username)) {
    callback(null, createErrorResponse(400, 'Incorrect email'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    User
      .find({ email: data.username })
      .then(user => {
        if(!user) callback(null, createErrorResponse(401, "Invalid username and/or password"))
        user = user[0]
        user = user.toObject(); //convert from mongo to json
        bcrypt.compare(data.password, user.password, (err, result) => {
          if(result) {

            //create spotifyAuthToken for user
            new Promise((resolve, reject) => {
              var SPOTIFY_KEY="40e7cf37f399406796151cd92509230b";
              var SPOTIFY_SECRET="2d11fc4ab38547739b14d8ce0b51a86e";
            
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
                if(error) reject(error)
                if (!error && response.statusCode === 200) {
                  // use the access token to access the Spotify Web API
                  var token = body.access_token;
                  resolve (token);
                }
              })
            }).then((spotifyToken) => {

              //create jwt
              data.spotifyToken = spotifyToken;
              user.spotifyToken = spotifyToken;
              let token=jwt.sign(
                data,
                'superSecretSecret',
                {expiresIn: '24h'}
              )

              delete(user.password); //do not return user's password :) 
              console.log(user)
              callback(null, { statusCode: 200, body: JSON.stringify({access_token:token, user:user}) });
            }).catch(err => {
              if(err.message && err.statusCode) callback(null, createErrorResponse(err.statusCode, err.message))
              else callback(null, createErrorResponse(501, JSON.stringify(err)))
            })



          }
          else callback(null, createErrorResponse(401, "Invalid username and/or password"))
        });
      })
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));

};

module.exports.registerUser = (event, context, callback) => {
  console.log(event.body);
  const data = JSON.parse(event.body);

  if (!validator.isEmail(data.email)) {
    callback(null, createErrorResponse(400, 'Incorrect email'));
    return;
  }

  let promise = new Promise(resolve => {
    dbConnectAndExecute(mongoString, () => (
      User
        .find({ email: data.email })
        .then(user => {
          console.log("user?",user);
          console.log(user.length)
          if(user.length === 0) resolve()
          else callback(null, createErrorResponse(409, "User with this email already exists"))
        })
        .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
    ));
  })
  promise.then(() => {
    //hash the password
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(data.password, salt, (err, hash) => {
        if(err) callback(null, createErrorResponse(501, err))
        data.password = hash;

        let user = new User({
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
          ip: event.requestContext.identity.sourceIp,
        });
        if (user.validateSync()) {
          callback(null, createErrorResponse(400, 'Incorrect user data'));
          return;
        }
      
        dbConnectAndExecute(mongoString, () => (
          user
            .save()
            .then(() => callback(null, {
              statusCode: 200,
              body: JSON.stringify({ id: user.id }),
            }))
            .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
        ));

      });
    });
  })

};

module.exports.user = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    User
      .find({ _id: event.pathParameters.id })
      .then(user => callback(null, { statusCode: 200, body: JSON.stringify(user) }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};


module.exports.deleteUser = (event, context, callback) => {
  if (!validator.isAlphanumeric(event.pathParameters.id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    User
      .remove({ _id: event.pathParameters.id })
      .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Ok') }))
      .catch(err => callback(null, createErrorResponse(err.statusCode, err.message)))
  ));
};

module.exports.updateUser = (event, context, callback) => {
  const data = JSON.parse(event.body);
  const id = event.pathParameters.id;

  if (!validator.isAlphanumeric(id)) {
    callback(null, createErrorResponse(400, 'Incorrect id'));
    return;
  }

  const user = new UserModel({
    _id: id,
    name: data.name,
    firstname: data.firstname,
    birth: data.birth,
    city: data.city,
    ip: event.requestContext.identity.sourceIp,
  });

  if (user.validateSync()) {
    callback(null, createErrorResponse(400, 'Incorrect parameter'));
    return;
  }

  dbConnectAndExecute(mongoString, () => (
    User.findByIdAndUpdate(id, user)
      .then(() => callback(null, { statusCode: 200, body: JSON.stringify('Ok') }))
      .catch(err => callback(err, createErrorResponse(err.statusCode, err.message)))
  ));
};