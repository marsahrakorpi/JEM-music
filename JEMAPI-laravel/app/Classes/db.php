<?php

namespace App\Classes;

use PDOException;

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

        try {
            $this->dbh = new \PDO('mysql:host='.$val['host'].';dbname='.$val['database'].';charset=utf8', $val['user'], $val['password'], array(\PDO::ATTR_ERRMODE => \PDO::ERRMODE_WARNING));
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function getTracks(){
        $query = "SELECT Track.id, Track.Name, Track.AlbumId as AlbumId, Artist.id as ArtistId, Track.Milliseconds, Track.Bytes, Track.UnitPrice FROM Track LEFT JOIN Album on Track.AlbumId = Album.id LEFT JOIN Artist on Album.ArtistId = Artist.id";
        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getAlbums(){
        $query = "SELECT * FROM Album LEFT JOIN Artist ON Artist.id = Album.ArtistId";
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