import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ControlPanelLi({linkData}) {
    const [active, setActive] = useState(false);
    let urlArray = location.pathname.split("/");
    let sectionParams = urlArray[2];

    useEffect(() => {
        linkData.topicID === sectionParams
        ? setActive(true) : setActive(false);
    }, [linkData.topicID, sectionParams]);    

    return (
        <li className={active ? "current" : ''}>
            <i className={`fa-solid ${linkData.icon}`}></i>
            <Link to={linkData.link} className={active ? "current" : ''}>
                {linkData.title}
            </Link>
        </li>

    );
}

ControlPanelLi.propTypes = {
    linkData: PropTypes.object.isRequired,
}

export default ControlPanelLi;