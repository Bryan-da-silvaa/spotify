import React from 'react';
import "./categories.css";

class Categories extends React.Component {
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
        var category = urlParams.get('category');
        if(category != null) {
            fetch("http://localhost/API/spotify.php?get=category&category=" + category).then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: 1
                });
                fetch("http://localhost/API/spotify.php?get=albums&category=" + category).then(res => res.json()).then((result) => {
                    this.setState({
                        isLoaded: true,
                        albums: result
                    });
                });
            });
        } else {
            fetch("http://localhost/API/spotify.php?get=categories").then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: result.length
                });
            });
        };
    }
    render() {
        this.state.call++;
        if(this.state.call === 3 && this.state.max > 1) {
            let content = <>
                <header>
                    <h1>Genres</h1>
                </header>
                <div className="categories">
                    <CategoriesList categories={this.state.data} max={this.state.max}/>
                </div>
            </>;
            return content;
        } else if(this.state.call === 5 && this.state.max === 1) {
            let content = <>
                <header>
                    <h1>Genre : <span>{this.state.data.name}</span></h1>
                </header>
                <div className="category">
                    <Category category={this.state.data} albums={this.state.albums}/>
                </div>
            </>;
            return content;
        } else {
            return <div></div>;
        };
    }
};

function Category(props) {
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
        <div className="categoryInfos">
            <div className="categoryPhoto">

            </div>
            <div className="categoryName">
                <h5>Genre</h5>
                <p>{props.category.name}</p>
            </div>
        </div>
        <div className="categoryAlbums">
            {albums}
        </div>
    </>;
    return content;
};

function CategoriesList(props) {
    let content = <>
        <Show categories={props.categories}/>
    </>;
    return content;
};

function Show(props) {
    let elements = [];
    props.categories.forEach((element) => {
        let image = "";
        if(element.name === 'Classical') {
            image = "http://he3.magnatune.com/music/Alan Rinehart/The Golden Century/cover_400.jpg" ;
        } else if(element.name === "New Age") {
            image = "http://he3.magnatune.com/music/Kourosh Dini/April 13, 2013/cover_400.jpg";
        } else if(element.name === "Electronica") {
            image = "http://he3.magnatune.com/music/Adam Fielding/Lightfields/cover_400.jpg";
        } else if(element.name === "World") {
            image = "http://he3.magnatune.com/music/Anamar/Transfado/cover_400.jpg";
        } else if(element.name === "Ambient") {
            image = "http://he3.magnatune.com/music/Robert Rich/Nest/cover_400.jpg";
        } else if(element.name === "Jazz") {
            image = "http://he3.magnatune.com/music/Antonio Ciacca Quartet/Driemoty/cover_400.jpg";
        } else if(element.name === "Hip Hop") {
            image = "http://he3.magnatune.com/music/A_Rival/8-Bit Pimp/cover_400.jpg";
        } else if(element.name === "Alt Rock") {
            image = "http://he3.magnatune.com/music/Ray Montford/Vintage is Now/cover_400.jpg";
        } else if(element.name === "Electro Rock") {
            image = "http://he3.magnatune.com/music/Anne Garner/Long Journey Here/cover_400.jpg";
        } else if(element.name === "Hard Rock") {
            image = "http://he3.magnatune.com/music/Caustic Casanova/Someday You Will Be Proven Correct/cover_400.jpg";
        }
        elements.push(<a href={"/genres?category=" + element.id} key={"category" + element.id}>
            <img src={image} alt={"Cover d'un album de type " + element.name}></img>
            <h4>{element.name}</h4>
        </a>);
    });
    let content = <div className="list">
        {elements}
    </div>;
    return content;
};

export default Categories;