import  { useRef } from 'react';
import { Route, Switch, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Sections from '../Sections/Sections';
import NewClass from '../NewClass/NewClass';
import Error404 from "../Error404/Error404.jsx";

function ControlPanel({ match }) {
    const navBar = useRef(null);
    let title = "";
    const handleClick = () => {
    navBar.current.classList.toggle("hidden");
    
    }
    return (
        <>
            <header>
                <button onClick={handleClick} id="index">Menú</button>
                <h1>  {`Panel de Control ${title} `}</h1>
            </header>
            <main>
                <nav className='sumario' ref={navBar}>
                    <ol>
                        <li>
                            <Link to="/controlPanel/newClass">Nueva Clase</Link>
                        </li>
                        <li>
                            <Link to="/controlPanel/newTopic">Nuevo Tema</Link>
                        </li>
                        <li>
                            <Link to="/controlPanel/newSection">Nueva Sección</Link>
                        </li>
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