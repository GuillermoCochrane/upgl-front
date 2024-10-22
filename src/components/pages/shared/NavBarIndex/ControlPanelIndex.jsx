import PropTypes from "prop-types";
import ControlPanelLi from "./ControlPanelLi";

function ControlPanelIndex({data}) {
    return (
        <li>
            <details name="nav">
                <summary>
                    <i className={`fa-solid ${data.icon}`}></i>
                    {data.summary}
                </summary>
                <ul>
                {
                    data.links.map((link, index) =>
                        <ControlPanelLi key={index} linkData={link} />
                    )
                }
                </ul>
            </details>
        </li>
    );
}

ControlPanelIndex.propTypes = {
    data: PropTypes.object.isRequired,
}

export default ControlPanelIndex;