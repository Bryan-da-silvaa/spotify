import React from 'react';
import "./search.css";

class Research extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: [],
            tracks: [],
            max: 0,
            call: 0
        }
    }
    componentDidMount() {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var albumId = urlParams.get('albums');
        var genresId = urlParams.get('genres');
        var artistsId = urlParams.get('artists');
        if (albumId != null) {
            fetch("http://localhost/API/spotify.php?get=album&album=" + albumId).then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: 1
                });
                fetch("http://localhost/API/spotify.php?get=tracks&album=" + albumId).then(res => res.json()).then((result) => {
                    this.setState({
                        isLoaded: true,
                        tracks: result
                    });
                });
            });
        } else if (artistsId != null) {
            fetch("http://localhost/API/spotify.php?get=Search&artists=" + artistsId).then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    artists: result,
                    max: 1
                });
            });
        } else if (genresId != null) {
            fetch("http://localhost/API/spotify.php?get=Search&genres=" + genresId).then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    genres: result,
                });
            });
        }
    }
    render() {
        let content = <>
            <header>
                <h1>Recherche</h1>
            </header>
            <div className="research"></div>
        </>;
        return content;
    }
}

export default Research;