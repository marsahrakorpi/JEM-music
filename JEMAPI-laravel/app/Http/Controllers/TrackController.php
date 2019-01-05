<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Classes\db;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrackController extends JEMController
{

    public function __construct(db $db) {
        $this->db = $db;
        $this->db->connect();
    }
    public function getAll() {
        $tracks = $this->db->getTracks();
        foreach($tracks as $track){
            $track->Album = $track->AlbumId;
            $track->Artist = $track->ArtistId;
        }
        return $tracks;
    }

    public function getTrack($id){
        $tracks = $this->db->getTrack($id);
        $res = new \stdClass();
        $res->tracks = $tracks;

        return json_encode($res);
    }

    public function putTrack(Request $request, $id){
        $track = $request->input('track');

        $track['id'] = $id;

        $this->db->editTrack($id, $track);

        $res = new \stdClass();

        //update artist if album is changed
        if (isset($track['AlbumId'])){
            $artist = $this->db->getAlbumArtist($track['AlbumId']);
            $track['Artist'] = current($artist)->id;
        } 

        $res->tracks = array($track);

        return json_encode($res);
    }

    public function deleteTrack($id){
        $this->db->deleteTrack($id);

        return Response()->json(200);
    }
    public function getOptions($id){
        return Response()->json(200);
    }
}
