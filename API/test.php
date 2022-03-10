<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: *");
    class Spotify {
        private $table;
        private $champ;
        private $bdd;
        public function __construct() {
            try {
                $this->bdd = new PDO('mysql:host=localhost;dbname=database_music;charset=utf8','root','', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,));
            } catch(PDOException $e) {
                echo $e->getMessage();
            };
        }     
        public function getArtist() {
            $req = $this->bdd->query("SELECT " . $this->Champ("artists.*, albums.name as Titre") .  " from " . $this->Table('artists') . " LEFT JOIN albums on artists.id = albums.artist_id");
            $row = $req->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($row);
        }
        public function getAlbums() {
            $champ = $this->Champ("albums.id AS 'artist',albums.artist_id, albums.name AS 'Albums', description, cover, release_date, popularity, tracks.id AS 'id_tracks', tracks.album_id AS 'tracks album id', tracks.name AS 'Liste des tracks', genres.id AS 'id_genres', genres.name AS 'Genres', genres_albums.album_id AS 'id album'");
            $req = $this->bdd->query("SELECT " . $champ . " FROM albums LEFT JOIN " . $this->Table('tracks') . " ON albums.id = tracks.album_id LEFT JOIN " . $this->Table('genres_albums') . " ON albums.artist_id = genres_albums.album_id LEFT JOIN " . $this->Table('genres') . " ON genres_albums.genre_id = genres.id");
            $row = $req->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($row);
        }
        public function Search() {
            $get = "Go For Broke";
            $champ = $this->Champ("tracks.name AS 'Titre de la musique', albums.name AS 'Titre de l\'album', artists.name AS 'Nom de l\'artiste', genres.name AS 'Genre'");
            $req = $this->bdd->query("SELECT " . $champ . " FROM albums LEFT JOIN " . $this->Table('tracks') . " ON albums.id = tracks.album_id LEFT JOIN " . $this->Table('genres_albums') . " ON albums.artist_id = genres_albums.album_id LEFT JOIN " . $this->Table('genres') . " ON genres_albums.genre_id = genres.id LEFT JOIN " . $this->Table('artists') . " ON albums.artist_id = artists.id WHERE tracks.name LIKE '%$get%' OR albums.name LIKE '%$get%' OR artists.name LIKE '%$get%' OR genres.name LIKE '%$get%'");
            $row = $req->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($row);
        }
        public function Table($table) {
            $this->table = $table;
            return $table;
        } 
        public function Champ($champ) {
            $this->champ = $champ;
            return $champ;
        }
    };
    $spotify = new Spotify;
    (isset($_GET["get"]) && $_GET["get"] == "artists") ? die(json_encode(["artists" => $spotify->getArtists()])) : null;