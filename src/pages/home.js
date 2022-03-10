import React from 'react';
import "./home.css";

class Home extends React.Component {
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
        var limit = urlParams.get('limit');
        var offset = urlParams.get('offset');
        if(limit != null && offset != null) {
            fetch("http://localhost/API/spotify.php?get=albums").then(res => res.json()).then((result) => {
                this.setState({
                    isLoaded: true,
                    data: result,
                    max: result.length
                });
                if(limit != null && offset != null) {
                    fetch("http://localhost/API/spotify.php?get=albums&limit=" + limit + "&offset=" + offset).then(res => res.json()).then((result) => {
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
                    <h1>Accueil</h1>
                </header>
                <div className="home">
                    <HomeList albums={this.state.data} max={this.state.max}/>
                </div>
            </>;
            return content;
        } else {
            return <div></div>;
        }
    }
};

function HomeList(props) {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let limit = urlParams.get('limit');
    let max = props.max;
    let pages = Math.ceil(max / limit);
    let content = <>
        <Show albums={props.albums}/>
        <Pagination pages={pages}/>
    </>;
    return content;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function Show(props) {
    let elements = [];
    props.albums.forEach((element) => {
        let timestamp = parseInt(element.release_date) * 1000;
        let date = new Date(timestamp);
        let year = date.getFullYear();
        elements.push(<a key={"album" + element.id} href={"/albums?album=" + element.id}>
            <img src={element.cover} alt={"Cover de l'album" + element.name}></img>
            <p className="year">{year}</p>
            <p className="popularity">Popularité : <span>{element.popularity}</span></p>
        </a>);
    });
    let content = <div className="list">
        {shuffle(elements)}
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
        links.push(<a href={"/albums?page=" + i + "&limit=50&offset=" + offset} key={"page" + i}>{i}</a>);
    };
    let content = <div className="pagination">
        {links}
    </div>;
    return content;
};

export default Home;