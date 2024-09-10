import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import InputSection from "../../shared/InputSection/InputSection"
import SelectSection from "../../shared/SelectSection/SelectSection";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewList = ({ courseID, classID, topicID, isOrdered }) => {
    const startingID = Date.now();
    const [items, setItems] = useState([{ id: startingID, value: "", content: "" }]);
    const [validations, setValidations] = useState([{id: startingID, value: { msg: "" }, content: { msg: "" }}]);
    const [listValidations, setListValidations] = useState({});
    const [stylesSelectors, setStylesSelectors] = useState([]); 
    const form = useRef(null);

    const addItem = () => {
        const newid = Date.now();
        setItems([...items, { id: newid, value: "" }]);
        setValidations([...validations, { id: newid, value: { msg: "" }, content: { msg: "" } }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
        setValidations(validations.filter(item => item.id !== id));
    };

    const updateItem = (id, value, field) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const createList = async (e) => {
        e.preventDefault();

        let type = "ul";
        if (isOrdered) {
            type = "ol";
        }
        let listEndpoint = `${apiUrl}api/course/newList/${courseID.toLowerCase()}/${classID}/${topicID}`;
        const formData = utilities.fetchData({type});

        try {
            const response = await fetch(listEndpoint, formData);
            const data = await response.json();
            
            if (data.meta.created) {
                setListValidations({success: `Se creo la lista`});
            } else {
                setListValidations({error: data.errors.type.msg});
            }
        }
        catch (error) {
            setListValidations(error.message);
            console.log(error);
        }
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

                        <section className="section-flex">
                            <label htmlFor={`${item.id}-value`}>Item {index + 1}</label>
                            <input
                                type="text"
                                id={`${item.id}-value`}
                                name={`item-${index}-value`}
                                value={item.value}
                                onChange={(e) => updateItem(item.id, e.target.value, 'value')}
                            />
                        </section>

                        <section className="section-flex">
                            <label htmlFor={`${item.id}-option`}>Estilo</label>
                            <select
                                id={`${item.id}-option`}
                                name={`item-${index}-option`}
                                value={item.content}
                                onChange={(e) => updateItem(item.id, e.target.value, 'content')}
                            >
                                <option value="">Seleccione un estilo</option>
                                {stylesSelectors.map((style) => (
                                    <option key={style.id} value={style.id}>{style.title}</option>
                                ))}
                            </select>
                        </section>
                    </aside>

                    <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>

                </article>
            ))}

            <span className={listValidations.success ? "success" : "error"}>
                {
                    listValidations.success ? listValidations.success : 
                    listValidations.error ? listValidations.error :
                    "\u00A0"
                }
            </span>

            <button type="button" onClick={addItem}>Agregar ítem</button>
            <button type="submit">Crear Lista</button>

            
        </form>
    );
};

NewList.propTypes = {
    courseID: PropTypes.string.isRequired,
    classID: PropTypes.string.isRequired,
    topicID: PropTypes.string.isRequired,
    isOrdered: PropTypes.bool.isRequired,
};

export default NewList;