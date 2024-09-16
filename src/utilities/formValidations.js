import validator from 'validator';
const apiUrl = import.meta.env.VITE_API_URL;

const formValidations = {

    required: function(input, error, form, oldValidations ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        if(validator.isEmpty(inputField)){
            newValidations[input] = {msg: `${error} es obligatorio`};
        } else {
        delete newValidations[input];
        }
        return newValidations;
    },

    length: function(input, error, form, oldValidations, min , max ){
        // min and max should be undefined (not null) if not required
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} debe tener`;
        if(!validator.isLength(inputField, { min, max })){
            msg += `al menos ${min} caracteres`;
            max ? msg += ` y como máximo ${max} caracteres` : null;
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    min: function(input, error, form, oldValidations, min ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} debe ser mayor que ${min}`;
        if(!validator.isLength(inputField, { min })){
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    max: function(input, error, form, oldValidations, max ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} debe ser menor que ${max}`;
        if(!validator.isLength(inputField, { min:0, max: max })){
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    url: function(input, error, form, oldValidations ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} no es un enlace válido`;
        if(!validator.isURL(inputField)){
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    numeric: function(input, error, form, oldValidations ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} no es un número`;
        if(!validator.isNumeric(inputField)){
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    requiredFile: function(input, error, form, oldValidations){
        let inputElement = form.current.elements[input];
        let newValidations = { ...oldValidations };
        delete newValidations.success;
    
        if (inputElement.files.length === 0) {
            newValidations[input] = { msg: `Olvido seleccionar ${error} ` };
        } else {
            delete newValidations[input];
        }
    
        return newValidations;
    },
    
    fileExtension: function(input,  form, oldValidations, allowedExtensions){
        let inputElement = form.current.elements[input];
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let fileExtension = `.${inputElement.value.split('.').pop().toLowerCase()}`;
        if (!allowedExtensions.includes(fileExtension)) {
            newValidations[input] = { msg: `El archivo debe ser ${allowedExtensions.join(', ')}` };
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },

    checkDBName: async function(input, form, oldValidations  ){
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${inputField} no es válido`;
        try {
            let response = await fetch(`${apiUrl}api/course/check/${inputField}`);
            let data = await response.json();
            if(data.inUse) {
                newValidations[input] = { msg: msg };
            } else {
                delete newValidations[input];
            }
        } catch (error) {
            console.error("Error checking DB name:", error);
            newValidations[input] = { msg: "Error al verificar el nombre. Intenta de nuevo." };
        }
        return newValidations;
    },

    notEmptyFields: function(validations, items, textError, contentError, form){
        let isValid = true;
        const newValidations = validations.map(validation => {
            const item = items.find(i => i.id === validation.id);
            if (!item) return validation; // Si no existe el item, mantener la validación actual

            const textName = `item-${item.id}-text`;
            const contentName = `item-${item.id}-content`;

            const textResult = this.required(textName,textError,form,{}) //this.required(textName, textError, form, {});
            const contentResult = this.required(contentName, contentError, form, {});

            if (textResult[textName] || contentResult[contentName]) {
                isValid = false;
            }

            return {
                ...validation,
                text: textResult[textName] || { msg: "" },
                content: contentResult[contentName] || { msg: "" }
            };
        });
        return {isValid, newValidations}
    }
}

export default formValidations;