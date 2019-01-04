<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Classes\db;

class ArtistController extends JEMController
{

    public function getAll() {
        $artists = $this->db->getArtists();
        $res = new \stdClass();
        $res->artists = $artists;

        return json_encode($res);
    }

    public function getArtist($id) {
        $artist = $this->db->getArtist($id);
        $res = new \stdClass();
        $res->artist = $artist;

        return json_encode($res);
    }
}
