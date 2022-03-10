import './navbar.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from '../../pages/home.js';
import Albums from '../../pages/albums.js';
import Categories from '../../pages/categories.js';
import Artists from '../../pages/artists.js';
import Research from '../../pages/research.js';

function Navbar() {
    let component = <Router>
        <nav id="navbar">
            <button id="menuButton" onClick={openMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
        <ul id="menu">
            <li>
                <i className="fas fa-atom"></i>
                <Link to="/?page=1&limit=50&offset=0">Accueil</Link>
            </li>
            <li>
                <i className="fas fa-atom"></i>
                <Link to="/albums?page=1&limit=50&offset=0">Albums</Link>
            </li>
            <li>
                <i className="fas fa-atom"></i>
                <Link to="/genres">Genres</Link>
            </li>
            <li>
                <i className="fas fa-atom"></i>
                <Link to="/artistes?page=1&limit=50&offset=0">Artistes</Link>
            </li>
            <li>
                <i className="fas fa-atom"></i>
                <Link to="/recherche">Recherche</Link>
            </li>
        </ul>
        <Switch>
            <Route path="/albums">
                <Albums/>
            </Route>
            <Route path="/genres">
                <Categories/>
            </Route>
            <Route path="/artistes">
                <Artists/>
            </Route>
            <Route path="/recherche">
                <Research/>
            </Route>
            <Route path="/">
                <Home/>
            </Route>
        </Switch>
    </Router>;
    function openMenu() {
        let menu = document.querySelector("#menu");
        menu.classList.toggle("toggleMenu");
    };
    return component;
};

export default Navbar;