import  { useRef, useState, useEffect } from "react";
import { Route, Switch, Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import PropTypes from "prop-types";
import Logo from "../../../assets/images/logoUPGL.png";
import Sections from "./Sections/Sections.jsx";
import NewCourse from "./NewCourse/NewCourse.jsx";
import NewClass from "./NewClass/NewClass.jsx";
import NewTopic from "./NewTopic/NewTopic.jsx";
import NewSection from "./NewSection/NewSection.jsx";
import Error404 from "../Error404/Error404.jsx";
import ControlPanelIndex from "../shared/NavBarIndex/ControlPanelIndex.jsx";

function ControlPanel({ match }) {
    const [links, setLinks] = useState([]);
    const navBar = useRef(null);

    const handleClick = () => {
        navBar.current.classList.toggle("hidden");
    }

    useEffect(() => {
        const fetchLinks = async () => {
            const response = await fetch(`${apiUrl}api/controlPanel/links`);
            const data = await response.json();
            setLinks(data.data);
        }
        fetchLinks();
    },
    []);  

    return (
        <>
            <header>
                <button onClick={handleClick} id="index">Menú</button>
                <h1>  {`Panel de Control `}</h1>    
                <Link to="/" className="logo-link">
                    <img src={Logo} alt="Logo de UPGL" className="logo-icon" />
                </Link>
            </header>
            <main>
            <nav className="sumario panel-index" ref={navBar}>
                <ul>
                {
                    links.map((item, idx) => 
                        <ControlPanelIndex data={item} key={idx} />
                    )
                }
                </ul>
            </nav>
            <Switch>
                <Route path={`${match.url}`} exact component={Sections} />
                <Route path={`${match.url}/newCourse`}  component={NewCourse} />
                <Route path={`${match.url}/newClass`}  component={NewClass} />
                <Route path={`${match.url}/newTopic`}  component={NewTopic} />
                <Route path={`${match.url}/newSection`}  component={NewSection} />
                <Route path={`${match.url}/editCourse`}  component={Sections} />
                <Route path={`${match.url}/editClass`}  component={Sections} />
                <Route path={`${match.url}/editTopic`}  component={Sections} />
                <Route path={`${match.url}/editSection`}  component={Sections} />
                <Route component={Error404} />
            </Switch>
            </main>
        </>
    )
}

ControlPanel.propTypes = {
    match: PropTypes.object.isRequired,
};
export default ControlPanel