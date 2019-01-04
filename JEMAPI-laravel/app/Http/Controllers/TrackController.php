<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Classes\db;

class TrackController extends JEMController
{

    public function __construct(db $db) {
        $this->db = $db;
    }
    public function getAll() {
        $tracks = $this->db->getTracks();
        foreach($tracks as $track){
            $track->Album = $track->AlbumId;
            $track->Artist = $track->ArtistId;
        }
        return $tracks;
    }
}
