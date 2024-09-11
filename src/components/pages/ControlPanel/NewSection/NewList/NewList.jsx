import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import InputSection from "../../shared/InputSection/InputSection"
import SelectSection from "../../shared/SelectSection/SelectSection";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewList = ({ courseID, classID, topicID, isOrdered }) => {
    const startingID = Date.now();
    const [items, setItems] = useState([{ id: startingID, text: "", content: "" }]);
    const [validations, setValidations] = useState([{id: startingID, text: { msg: "" }, content: { msg: "" }}]);
    const [listValidations, setListValidations] = useState({});
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const [listSection, setListSection] = useState(0);
    const form = useRef(null);

    const updateItem = (id, value, field) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addItem = () => {
        const newid = Date.now();
        setItems([...items, { id: newid, text: "", content: "" }]);
        setValidations([...validations, { id: newid, text: { msg: "" }, content: { msg: "" } }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
        setValidations(validations.filter(item => item.id !== id));
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
                const liEndpoint = `${apiUrl}api/course/newLi/${courseID.toLowerCase()}/${classID}/${topicID}/${data.meta.section}`;
                const successfulItemIds = [];

                for (const item of items) {
                    const liFormData = utilities.fetchData({type: "li", content: item.content, text: item.text});
                    const res = await fetch(liEndpoint, liFormData);
                    const liData = await res.json();
                    if (liData.meta.created) {
                        successfulItemIds.push(item.id);
                    } else {
                        console.log(liData.errors); 
                        console.log(liData.oldData);                       
                    }
                }

                const newItems = items.filter(item => !successfulItemIds.includes(item.id));
                setItems(newItems);

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
                            <label htmlFor={`${item.id}-text`}>Item {index + 1}</label>
                            <input
                                type="text"
                                id={`${item.id}-text`}
                                name={`item-${index}-text`}
                                value={item.text}
                                onChange={(e) => updateItem(item.id, e.target.value, 'text')}
                            />
                        </section>

                        <section className="section-flex">
                            <label htmlFor={`${item.id}-content`}>Estilo</label>
                            <select
                                id={`${item.id}-content`}
                                name={`item-${index}-content`}
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