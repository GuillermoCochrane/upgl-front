import validator from 'validator';
const apiUrl = import.meta.env.VITE_API_URL;

const formValidations = {

    required: (input, error, form, oldValidations ) => {
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

    length: (input, error, form, oldValidations, min , max ) => {
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

    min: (input, error, form, oldValidations, min ) => {
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

    max: (input, error, form, oldValidations, max ) => {
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

    url: (input, error, form, oldValidations ) => {
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

    numeric: (input, error, form, oldValidations ) => {
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

    requiredFile: (input, error, form, oldValidations) => {
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
    
    fileExtension: (input,  form, oldValidations, allowedExtensions) => {
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
    

    checkDBName: async (input, form, oldValidations  ) => {
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
}

export default formValidations;