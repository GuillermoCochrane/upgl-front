const apiUrl = import.meta.env.VITE_API_URL;
const utilities = {
  updateInput: (input, value, oldData) => {
    let newData = {...oldData};
    newData[input] = value;
    return newData;
  },

  validationsAlerts (input, validations, form) {
      if (validations[input]) {
          form.current.elements[input].classList.remove('success');
          form.current.elements[input].classList.add('error');
      } else {
          form.current.elements[input].classList.remove('error');
          form.current.elements[input].classList.add('success');
      }
  },

  selectRemover: (removeSelector , selectorData) => {
    let newSelectorData = [];
    for (const selector of selectorData) {
      if (selector.id != removeSelector) {
        newSelectorData.push(selector);
      }
    }
    return newSelectorData;
  },

  sectionHandler: (state ,section1, section2, button1, button2) => {
    if (state) {
      section1.current.hidden = true;
      section2.current.hidden = false;
      button1.current.classList.remove("active");
      button2.current.classList.add("active");
    } else {
      section1.current.hidden = false;
      section2.current.hidden = true; 
      button1.current.classList.add("active");
      button2.current.classList.remove("active");
    }
  },

  resetValidations: (input, form) => {
    form.current.elements[input].classList.remove('success');
    form.current.elements[input].classList.remove('error');
  },

  resetForm: function (form, inputs) {
    inputs.forEach(input => this.resetValidations(input, form));
  },
  
  fetchData: (info) => {
    let data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    return data;
  },

  fetchStylesData: async () => {
    const endpoint = `${apiUrl}api/controlpanel/styles`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.data;
    }
    catch (error) {
      console.log(error);
      return [];
    }
  },
}

export default utilities