<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: *");
    header("Content-Type: application/json; charset=UTF-8");
    class Spotify {
        private $bdd;
        public function __construct() {
            try {
                $this->bdd = new PDO('mysql:host=localhost;dbname=database_music;charset=utf8', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
            } catch(PDOException $e) {
                echo $e->getMessage();
            };
        }
        public function getArtist() {
            $request = $this->bdd->prepare("SELECT * FROM artists WHERE id = " . $_GET["artist"] . ";");
            $request->execute();
            $result = $request->fetch(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getArtists($limit) {
            if($limit) {
                $request = $this->bdd->prepare("SELECT * FROM artists LIMIT " . $_GET["limit"] . " OFFSET " . $_GET["offset"] . ";");
            } else {
                $request = $this->bdd->prepare("SELECT * FROM artists;");
            };
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getAlbum() {
            $request = $this->bdd->prepare("SELECT * FROM albums WHERE id = " . $_GET["album"] . ";");
            $request->execute();
            $result = $request->fetch(PDO::FETCH_ASSOC);
            $request2 = $this->bdd->prepare("SELECT genres.name AS 'genre' FROM albums, genres INNER JOIN genres_albums ON genres.id = genres_albums.genre_id WHERE genres_albums.album_id = " . $_GET["album"] . " GROUP BY genres.name;");
            $request2->execute();
            $result2 = $request2->fetchAll(PDO::FETCH_ASSOC);
            return array_merge($result, ["genres" => $result2]);
        }
        public function getAlbumTracks() {
            $request = $this->bdd->prepare("SELECT * FROM tracks WHERE album_id = " . $_GET["album"] . ";");
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getAlbums($limit) {
            if($limit) {
                $request = $this->bdd->prepare("SELECT * FROM albums LIMIT " . $_GET["limit"] . " OFFSET " . $_GET["offset"] . ";");
            } else {
                $request = $this->bdd->prepare("SELECT * FROM albums;");
            };
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getArtistAlbums() {
            $request = $this->bdd->prepare("SELECT * FROM albums WHERE artist_id = " . $_GET["artist"] . ";");
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getCategory() {
            $request = $this->bdd->prepare("SELECT * FROM genres WHERE id = " . $_GET["category"] . ";");
            $request->execute();
            $result = $request->fetch(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getCategories() {
            $request = $this->bdd->prepare("SELECT * FROM genres;");
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function getCategoryAlbums() {
            $request = $this->bdd->prepare("SELECT albums.id ,albums.name, albums.description, albums.cover, albums.release_date, albums.popularity FROM albums LEFT JOIN genres_albums ON albums.id = genres_albums.album_id LEFT JOIN genres ON genres.id = genres_albums.genre_id WHERE genres.id = " . $_GET["category"] . ";");
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        public function Search($search) {
            $artists = $_GET['artists'];
            $tracks = $_GET['tracks'];
            $albums = $_GET['albums'];
            $genres = $_GET['genres'];
            if ($search == 'artists') $request = $this->bdd->prepare("SELECT * FROM artists WHERE artists.name = " . "$artists");
            else if ($search == 'tracks') $request = $this->bdd->prepare("SELECT * FROM tracks WHERE tracks.name = " . "$tracks");
            else if ($search == 'albums') $request = $this->bdd->prepare("SELECT * FROM albums WHERE albums.name = " . "$albums");
            else if ($search == 'genres') $request = $this->bdd->prepare("SELECT albums.*, genres.name FROM albums LEFT JOIN genres_albums ON albums.id = genres_albums.album_id LEFT JOIN genres ON genres.id = genres_albums.genre_id WHERE genres.name = " . "$genres");
            $request->execute();
            $result = $request->fetchAll(PDO::FETCH_ASSOC);
            return $result;
            }
    };
    $spotify = new Spotify;
    (isset($_GET["get"]) && $_GET["get"] == "artist") ? die(json_encode($spotify->getArtist())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "artists" && !isset($_GET["limit"]) && !isset($_GET["offset"])) ? die(json_encode($spotify->getArtists(false))) : null;
    (isset($_GET["get"]) && $_GET["get"] == "artists" && isset($_GET["limit"]) && isset($_GET["offset"])) ? die(json_encode($spotify->getArtists(true))) : null;
    (isset($_GET["get"]) && $_GET["get"] == "album") ? die(json_encode($spotify->getAlbum())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "albums" && !isset($_GET["category"]) && !isset($_GET["limit"]) && !isset($_GET["offset"]) && !isset($_GET["artist"])) ? die(json_encode($spotify->getAlbums(false))) : null;
    (isset($_GET["get"]) && $_GET["get"] == "albums" && !isset($_GET["category"]) && isset($_GET["limit"]) && isset($_GET["offset"]) && !isset($_GET["artist"])) ? die(json_encode($spotify->getAlbums(true))) : null;
    (isset($_GET["get"]) && $_GET["get"] == "albums" && !isset($_GET["category"]) && isset($_GET["artist"])) ? die(json_encode($spotify->getArtistAlbums())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "tracks" && isset($_GET["album"])) ? die(json_encode($spotify->getAlbumTracks())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "category") ? die(json_encode($spotify->getCategory())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "categories") ? die(json_encode($spotify->getCategories())) : null;
    (isset($_GET["get"]) && $_GET["get"] == "albums" && isset($_GET["category"])) ? die(json_encode($spotify->getCategoryAlbums())) : null;
