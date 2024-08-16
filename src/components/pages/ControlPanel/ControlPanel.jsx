import  { useRef, useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
import PropTypes from 'prop-types';
import Sections from '../Sections/Sections';
import NewClass from '../NewClass/NewClass';
import Error404 from "../Error404/Error404.jsx";
import ControlPanelIndex from "../../partials/NavBarIndex/ControlPanelIndex.jsx";

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
            </header>
            <main>
            <nav className='sumario panel-index' ref={navBar}>
                <ol>
                {
                    links.map((item, idx) => 
                        <ControlPanelIndex linkData={item} key={idx} />
                    )
                }
                </ol>
            </nav>
                <Switch>
                    <Route path={`${match.url}`} exact component={Sections} />
                    <Route path={`${match.url}/newClass`}  component={NewClass} />
                    <Route path={`${match.url}/newTopic`}  component={Sections} />
                    <Route path={`${match.url}/newSection`}  component={Sections} />
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