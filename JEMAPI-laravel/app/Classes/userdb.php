<?php

namespace App\Classes;

use PDOException;

/**
 * Class ttdb
 * @package App\Classes
 * 
 */
class userdb {

    var $dbh;

    /**
     * Connects to database using php PDO-extension
     */
    function connect() {

        $val = array(
            'host' => getenv('DB_HOST'),
            'database' => getenv('DB_USERDATABASE'),
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

    function createUser($email, $password, $firstname = null, $lastname = null, $userlevel = 1) {
        $query = "INSERT INTO Users
            (
                Email,
                Password,
                Firstname,
                Lastname,
                Userlevel
            )
            VALUES
            (
                :email,
                :password,
                :firstname,
                :lastname,
                :userlevel
            )";

        $sth = $this->dbh->prepare($query);
        $sth->execute(['email' => $email, 'password' => $password, 'userlevel' => $userlevel, 'firstname' => $firstname, 'lastname' => $lastname]);

    }

    function getUserWithEmail($email){
        
        $query = "SELECT id FROM Users WHERE Email = \"".$email."\"";

        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getHashedPassword($email){
        $query = "SELECT Password FROM Users WHERE Email = \"".$email."\" LIMIT 1";

        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }

    function getUserInfo($email){
        $query = "SELECT id, email, firstname, lastname, userlevel FROM Users WHERE Email = \"".$email."\" LIMIT 1";

        $sth = $this->dbh->prepare($query);
        $sth->execute();

        return $sth->fetchAll((\PDO::FETCH_OBJ));
    }
}

?>