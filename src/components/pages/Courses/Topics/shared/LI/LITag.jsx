import PropTypes from "prop-types";
import {Fragment} from "react";
import Bold from "../Styles/Bold/Bold"
import Mark from "../Styles/Mark/Mark"
import Italic from "../Styles/Italic/Italic"
import Underline from "../Styles/Underline/Underline"
import OL from "../../OL/OLTag";
import UL from "../../UL/ULTag";
import H4 from "../../H4/H4Tag";
import P from "../../P/PTag";
import Figure from "../../Figure/Figure";

function LITag({Data}) {
    return (
        <li>
            {
                Data.info.map((item, index) => (
                    <Fragment key = {index}>
                        {
                            item.content == "plain" && item.text
                        }
                        {
                            item.content == "link" && item.text
                        }
                        {
                            item.content == "bold" && <Bold key = {index} Data = {item.text} />
                        }
                        {
                            item.content == "italic" && <Italic key = {index} Data = {item.text} />
                        }
                        {
                            item.content == "underline" && <Underline key = {index} Data = {item.text} />
                        }
                        { 
                            item.content == "mark" && <Mark key = {index} Data = {item.text} />
                        }
                        {
                            item.type == "ul" && <UL Data = {item.info}  key = {index} />
                        }
                        {
                            item.type == "ol" && <OL Data = {item.info}  key = {index} />
                        }
                        {
                            item.type == "h4" && <H4  Data = {item.info}  key = {index} />
                        }
                        {
                            item.type == "p" && <P  Data = {item.info}  key = {index} />
                        }
                        {
                            item.type == "figure" && <Figure  Data = {item.info}  key = {index} />
                        }
                    </Fragment>
                ))
            }
        </li>
    );
}

LITag.propTypes = {
    Data: PropTypes.object.isRequired
};

export default LITag;