<?php
use MongoDB\Client as Mongo;
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
Route::get('mongo', function(Request $request) {
    $collection = (new Mongo)->mydatabase->mycollection;
    return $collection->find()->toArray();
});
Route::get('/', function () {
    return view('welcome');
});
