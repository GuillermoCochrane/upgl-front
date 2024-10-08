import PropTypes from "prop-types";

const SelectSection = ({ 
  name,
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  validations,
  styles,
  selectStyles,
  optionMsg,
  optionReferences,
  itemID,
  stateField
}) => {

  return (
  <section className={styles}>
    <label htmlFor={id}> {label} </label>
    
    <select
      name={name}
      id={id}
      value={value}
      onChange={(e) => {
        const selectValue = e.target.value;
        onChange(name,selectValue,itemID,stateField);
        onBlur ? onBlur(selectValue) : null;
      }}
      onBlur={() => onBlur ? onBlur(value) : null}
      className={selectStyles}
    >
      {
        options.length == 0 ? 
        <option value="">{optionMsg}</option> :
        <option value="">---</option>
      }

      {options.map((option, index) => (
        <option 
          key={index} 
          value={ option[optionReferences.value] }

        >
          { option[optionReferences.name] }
        </option>
      ))}

    </select>
    
    {
      <span className="error">
        {
          validations && validations[name] ? validations[name].msg :
          validations && validations[stateField] ? 
                          validations[stateField].msg === "" ? "\u00A0" : validations[stateField].msg : 
          "\u00A0"
        }
      </span> 
    }

  </section>);
};

SelectSection.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  options: PropTypes.array.isRequired,
  validations: PropTypes.object,
  styles: PropTypes.string,
  selectStyles: PropTypes.string,
  optionMsg: PropTypes.string,
  optionReferences: PropTypes.object,
  itemID: PropTypes.number,
  stateField: PropTypes.string,
};
export default SelectSection;