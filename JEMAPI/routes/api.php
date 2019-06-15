<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::post('/login', 'UsersController@login');
Route::post('/register', 'UsersController@register');

Route::get('/getAll', 'JEMController@getAll');

Route::get('/tracks', 'TrackController@getAll');
Route::options('/tracks/{id}', 'TrackController@getOptions');
Route::put('/tracks/{id}', 'TrackController@putTrack');
Route::delete('/tracks/{id}', 'TrackController@deleteTrack');

Route::get('/albums', 'AlbumController@getAll');
Route::get('/albums/{id}', 'AlbumController@getAlbum');

Route::get('/artists', 'ArtistController@getAll');
Route::get('/artists/{id}', 'ArtistController@getArtist');

Route::get('/SpotifyAuthentication', 'SpotifyController@authenticate');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
