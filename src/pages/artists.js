import React from 'react';
import "./artists.css";

class Artists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: [],
            albums: [],
            max: 0,
            call: 0
        };
    }
    componentDidMount() {
        var queryString = window.location.search;
        var urlParams = new URLSearchParams(queryString);
        var limit = urlParams.get('limit');
        var offset = urlParams.get('offset');
        var artist = urlParams.get('artist');
        if(artist != null) {
            fetch("http://localhost/API/spotify.php?get=artist&artist=" + artist).then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: 1
                });
                fetch("http://localhost/API/spotify.php?get=albums&artist=" + artist).then(res => res.json()).then((result) => {
                    this.setState({
                        isLoaded: true,
                        albums: result
                    });
                });
            });
        } else {
            fetch("http://localhost/API/spotify.php?get=artists").then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: result.length
                });
                if(limit != null && offset != null) {
                    fetch("http://localhost/API/spotify.php?get=artists&limit=" + limit + "&offset=" + offset).then(res => res.json()).then((result) => {
                        this.setState({
                            isLoaded: true,
                            data: result
                        });
                    });
                };
            });
        };
    }
    render() {
        this.state.call++;
        if(this.state.call === 5 && this.state.max > 1) {
            let content = <>
                <header>
                    <h1>Artistes</h1>
                </header>
                <div className="artists">
                    <ArtistsList artists={this.state.data} max={this.state.max}/>
                </div>
            </>;
            return content;
        } else if(this.state.call === 5 && this.state.max === 1) {
            let content = <>
                <header>
                    <h1>Artiste : <span>{this.state.data.name}</span></h1>
                </header>
                <div className="artist">
                    <Artist artist={this.state.data} albums={this.state.albums}/>
                </div>
            </>;
            return content;
        } else {
            return <div></div>;
        };
    }
};

function Artist(props) {
    let albums = [];
    props.albums.forEach((element) => {
        let timestamp = parseInt(element.release_date) * 1000;
        let date = new Date(timestamp);
        let year = date.getFullYear();
        albums.push(<a key={"album" + element.id} href={"/albums?album=" + element.id}>
            <img src={element.cover} alt={"Cover de l'album" + element.name}></img>
            <p className="year">{year}</p>
            <p className="popularity">Popularité : <span>{element.popularity}</span></p>
        </a>);
    });
    let content = <>
        <div className="artistInfos">
            <div className="artistPhoto">
                <img src={props.artist.photo} alt={"Photo de " + props.artist.name}></img>
            </div>
            <div className="artistDescription">
                <h5>Description</h5>
                <p>{props.artist.description}</p>
            </div>
            <div className="artistBiography">
                <h5>Biographie</h5>
                <p>{props.artist.bio}</p>
            </div>
        </div>
        <div className="artistDetails">
            <h2><i className="fas fa-atom"></i>Albums</h2>
            <div className="artistAlbums">
                {albums}
            </div>
        </div>
    </>;
    return content;
};

function ArtistsList(props) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let limit = urlParams.get('limit');
    let max = props.max;
    let pages = Math.ceil(max / limit);
    let content = <>
        <Show artists={props.artists}/>
        <Pagination pages={pages}/>
    </>;
    return content;
};

function Show(props) {
    let elements = [];
    props.artists.forEach((element) => {
        elements.push(<a href={"/artistes?get=artist&artist=" + element.id} key={"artist" + element.id}>
            <img src={element.photo} alt={"Photo de " + element.name}></img>
            <h4 title={element.name}>{(element.name.length > 16) ? element.name.substr(0, 13) + "..." : element.name}</h4>
        </a>);
    });
    let content = <div className="list">
        {elements}
    </div>;
    return content;
};

function Pagination(props) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let limit = urlParams.get('limit');
    let links = [];
    let i = 0;
    while(i < props.pages) {
        i++;
        let offset = (i * limit) - limit;
        links.push(<a href={"/artistes?page=" + i + "&limit=50&offset=" + offset} key={"page" + i}>{i}</a>);
    };
    let content = <div className="pagination">
        {links}
    </div>;
    return content;
};

export default Artists;