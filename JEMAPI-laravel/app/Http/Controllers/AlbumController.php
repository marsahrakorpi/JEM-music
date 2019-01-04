<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Classes\db;

class AlbumController extends JEMController
{

    public function getAll() {
        $albums = $this->db->getAlbums();

        foreach($albums as $album){

            $album->Artist = $album->ArtistId;
            unset($album->Name); //actually artist's name

        }
        $res = new \stdClass();
        $res->albums = $albums;
        
        $artists = $this->db->getArtists();
        $res->artists = $artists;
        return json_encode($res);
    }

    public function getAlbum($id) {
        $albums = $this->db->getAlbum($id);
        $res = new \stdClass();
        $res->albums = $albums;

        return json_encode($res);
    }
}
