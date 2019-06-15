<?php

namespace App\Classes;

use MongoDB\Client as Mongo;

/**
 * Class ttdb
 * @package App\Classes
 * 
 */
class db {

    var $dbh;

    /**
     * Connects to database using php PDO-extension
     */
    function connect() {

        $val = array(
            'host' => getenv('DB_HOST'),
            'database' => getenv('DB_DATABASE'),
            'user' => getenv('DB_USERNAME'),
            'password' => getenv('DB_PASSWORD')
        );
        #var_dump($val); die();
        try {
            $this->dbh = new \PDO('mysql:host='.$val['host'].';dbname='.$val['database'].';charset=utf8', $val['user'], $val['password'], array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_WARNING));
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function getTracks(){
        $query = "SELECT 
            Track.TrackId,
            Track.Name, 
            Track.AlbumId as AlbumId,
            Artist.ArtistId as ArtistId, 
            Track.Milliseconds, 
            Track.Bytes, 
            Track.UnitPrice, 
            Track.Composer
            FROM Track 
            LEFT JOIN Album ON Track.AlbumId = Album.AlbumId 
            LEFT JOIN Artist on Album.ArtistId = Artist.ArtistId";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getTrack($id){

        $query = "SELECT * FROM Track WHERE Track.id = $id";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function editTrack($id, $track){

        $params = array(
            "id" => $id,
            "name" => $track['Name'],
            "albumid" => isset($track['AlbumId']) ? $track['AlbumId'] : null,
            "composer" => isset($track['Composer']) ? $track['Composer'] : null,
            "milliseconds" => isset($track['Milliseconds']) ? $track['Milliseconds'] : null,
            "price" => isset($track['UnitPrice']) ? $track['Milliseconds'] : null,
            "bytes" => isset($track['Bytes']) ? $track['Bytes'] : null
        );

        $query = "UPDATE Track
            SET 
                Name = :name,
                AlbumId = :albumid,
                Composer = :composer,
                Milliseconds = :milliseconds,
                UnitPrice = :price,
                Bytes = :bytes
            WHERE
                id = :id
        ";

        $sth = $this->dbh->prepare($query);
        $sth->execute($params);

    }

    function deleteTrack($id){

        $query = "DELETE FROM Track WHERE id = $id";

        $sth = $this->dbh->prepare($query);
        $sth->execute();

    }


    function getAlbums(){

        $query = "SELECT Album.AlbumId, Album.Title, Artist.ArtistId AS Artist, Artist.Name AS Name FROM Album LEFT JOIN Artist ON Artist.ArtistId = Album.ArtistId";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getAlbum($id){

        $query = "SELECT * FROM Album WHERE Album.id = $id";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getAlbumArtist($albumId){
        $query = "SELECT Artist.ArtisId, Artist.Name FROM Artist LEFT JOIN Album ON Artist.id = Album.ArtistId WHERE Album.id = $albumId";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }



    function getArtists(){
        $query = "SELECT * FROM Artist";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getArtist($id){

        $query = "SELECT * FROM Artist WHERE Artist.id = $id";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

}
?>