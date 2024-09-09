import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import InputSection from "../../shared/InputSection/InputSection"
import SelectSection from "../../shared/SelectSection/SelectSection";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewList = ({ courseID, classID, topicID }) => {
    const [items, setItems] = useState([{ id: Date.now(), value: "", selectedOption: "" }]);
    const [validations, setValidations] = useState({});
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const form = useRef(null);

    const addItem = () => {
        const newItem = { id: Date.now(), value: "", selectedOption: "" };
        const updatedItems = items.slice(); 
        updatedItems.push(newItem); 
        setItems(updatedItems);
    };

    const removeItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
    };

    const updateItem = (id, key, value) => {
        const updatedItems = items.map(item => 
            item.id === id ? { ...item, [key]: value } : item
        );
        setItems(updatedItems);
    };

    const createList = async (e) => {
        e.preventDefault();
        console.log(items);
    };

    useEffect(() => {
        const fetchStyles = async () => {
            const stylesData = await utilities.fetchStylesData();
            setStylesSelectors(stylesData);
        };
        fetchStyles();
    }, []);

    return (
        <form ref={form} onSubmit={createList} className="panel-form">
            {items.map((item, index) => (

                <article key={item.id} className="list-item">
                    <aside>

                        <InputSection
                            styles={"section-flex"}
                            type="text"
                            name={`item-${index}-value`}
                            id={`item-${index}-value`}
                            label={`Item ${index + 1}`}
                            value={item.value}
                            onChange={(value) => updateItem(item.id, 'value', value)}
                            validations={validations}
                        />

                        <SelectSection
                            styles={"section-flex"}
                            name={`item-${index}-option`}
                            id={`item-${index}-option`}
                            label="Estilo"
                            value={item.selectedOption}
                            onChange={(value) => updateItem(item.id, 'selectedOption', value)}
                            options={stylesSelectors}
                            optionReferences={{ value: "id", name: "title" }}
                            validations={validations}
                            optionMsg="Cargando estilos..."
                        />

                    </aside>

                    <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>
                </article>
            ))}

            <button type="button" onClick={addItem}>Agregar ítem</button>

            <button type="submit">Crear Lista</button>
            
            <span className="success">
                {validations.success ? validations.success : "\u00A0"}
            </span>
        </form>
    );
};

NewList.propTypes = {
    courseID: PropTypes.string.isRequired,
    classID: PropTypes.string.isRequired,
    topicID: PropTypes.string.isRequired,
};

export default NewList;
