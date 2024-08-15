import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function NavIndex({linkData}) {
    const [active, setActive] = useState(false);
    let urlArray = location.pathname.split("/");
    let sectionParams = urlArray[2];
    
    useEffect(() => {
        linkData.topicID === sectionParams
        ? setActive(true) : setActive(false);
    }, [linkData.topicID, sectionParams]);

    return (
        <li className={active ? 'current' : ''}>
            <hr />
            <Link to={linkData.link } className={active ? 'current' : ''}>
                {linkData.title}
            </Link>
        </li>
    );
}

NavIndex.propTypes = {
    linkData: PropTypes.object.isRequired,
}

export default NavIndex;