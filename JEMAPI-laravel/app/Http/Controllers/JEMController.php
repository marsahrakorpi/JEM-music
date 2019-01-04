<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\BaseController;
use App\Classes\db;
use App\Http\Controllers\TrackController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\ArtistController;


use Illuminate\Http\Request;

class JEMController extends BaseController
{
    protected $db;
    private $trackController;
    public function __construct(db $db){

        $this->db = $db;
        $this->db->connect();

        $this->trackController = new TrackController($this->db);
    }

    public function getAll(){
        $res = new \stdClass();

        //albums
        $albums = $this->db->getAlbums();
        foreach($albums as $album){
            $album->Artist = $album->ArtistId;
            unset($album->Name); //actually artist's name
        }
        $res->albums = $albums;
        
        $artists = $this->db->getArtists();
        $res->artists = $artists;

        $tracks = $this->trackController->getAll();
        $res->tracks = $tracks;

        return json_encode($res);
    }

    public function get_response($response) {
        return response()->json($response, 200);
    }
}
