import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
const apiUrl = import.meta.env.VITE_API_URL;
import utilities from "../../../../../utilities/utilities";
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";

const NewTrivia = ({ courseID, classID, topicID,  reset   }) => {
  const startingID = Date.now();
    const [order, setOrder] = useState(1);
    const [items, setItems] = useState([{ id: startingID, text: "", content: "", order: 1 }]);
    const [validations, setValidations] = useState([{id: startingID, text: { msg: "" }, content: { msg: "" }}]);
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const form = useRef(null);
    const inputLabel = "Opción de trivia: ";

    const addItem = () => {
        const newStub = utilities.addStub(items,validations,order)
        setOrder(newStub.order)
        setItems(newStub.items)
        setValidations(newStub.validations)
    };

    const removeItem = (id) => {
        const removedStubs = utilities.removeStub(items,validations,id)
        setItems(removedStubs.items);
        setValidations(removedStubs.validations);
    };

    const updateItem = (unused , value, id, name ) => {
        setItems(utilities.updateStubs(items, value, id, name));
    };  

    useEffect(() => {
        const fetchStyles = async () => {
            const stylesData = await utilities.fetchStylesData();
            setStylesSelectors(stylesData);
        };
        fetchStyles();
    }, []);

  return (
    <form ref={form}  className="panel-form">
        {items.map((item, index) => (

        <article className="list-item" key={index}>
            <aside>

                <Input
                    type="text"
                    name={`item-${item.id}-text`}
                    id={`${item.id}-text`}
                    value={item.text}
                    onChange={updateItem}
                    label={`${inputLabel} ${index + 1}`}
                    styles={"section-flex"}
                    itemID={item.id}
                    stateField={"text"}
                />

            </aside>

            <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>

        </article>

        ))}

        <button type="button" onClick={addItem}>Agregar ítem</button>
        <button type="submit">Crear Lista</button>

    </form>
);
}

NewTrivia.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewTrivia;