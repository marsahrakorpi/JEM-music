<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/getAll', 'JEMController@getAll');

Route::get('/tracks', 'TrackController@getAll');

Route::get('/albums', 'AlbumController@getAll');
Route::get('/albums/{id}', 'AlbumController@getAlbum');

Route::get('/artists', 'ArtistController@getAll');
Route::get('/artists/{id}', 'ArtistController@getArtist');

Route::get('/SpotifyAuthentication', 'SpotifyController@authenticate');
Route::get('/', function () {
    return view('welcome');
});
