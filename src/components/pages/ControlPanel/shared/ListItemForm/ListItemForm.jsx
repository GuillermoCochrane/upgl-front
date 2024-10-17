import PropTypes from "prop-types";
import Input from "../InputSection/InputSection";
import Select from "../SelectSection/SelectSection";

function ListItemForm( {item, index, validations, stylesSelectors, updateItem,  validateText, validateContent, validationsManager, removeItem, inputLabel}) {
    return (
        <article className="list-item">
            <aside>

                <Input
                    type="text"
                    name={`item-${item.id}-text`}
                    id={`${item.id}-text`}
                    value={item.text}
                    onChange={updateItem}
                    onBlur={() => validateText(item.id)}
                    onInput={() => validateText(item.id)}
                    label={`${inputLabel}: ${index + 1}`}
                    styles={"section-flex"}
                    itemID={item.id}
                    stateField={"text"}
                    validations={validationsManager(item.id, validations)}
                />

                <Select
                    styles={"section-flex"}
                    name={`item-${item.id}-content`}
                    id={`${item.id}-content`}
                    value={item.content}
                    label="Estilo del texto"
                    onChange={updateItem}
                    onBlur={() => validateContent(item.content, item.id)}
                    options={stylesSelectors}
                    validations={validationsManager(item.id, validations)}
                    optionReferences={{value: "id", name: "title"}}
                    itemID={item.id}
                    stateField={"content"}
                />
            </aside>

            <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>

        </article>
    )   
}

ListItemForm.propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    validations: PropTypes.array.isRequired,
    stylesSelectors: PropTypes.array.isRequired,
    updateItem: PropTypes.func.isRequired,
    validateText: PropTypes.func.isRequired,
    validateContent: PropTypes.func.isRequired,
    validationsManager: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    inputLabel: PropTypes.string.isRequired,
};

export default ListItemForm;