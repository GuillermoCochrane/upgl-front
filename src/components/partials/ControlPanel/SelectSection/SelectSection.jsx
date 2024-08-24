import PropTypes from 'prop-types';

const SelectSection = ({ 
  name,
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  validations,
  styles
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
        onChange(name,selectValue);
        onBlur ? onBlur(selectValue) : null;
      }}
      onBlur={() => onBlur ? onBlur(value) : null}
    >
      <option value=""> --- </option>

      {options.map((option, index) => (
        <option 
          key={index} 
          value={option.id}
        >
          {option.name}
        </option>
      ))}

    </select>
    
    {
      <span className='error'>
        {validations[name] ? validations[name].msg : "\u00A0"}
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
};
export default SelectSection;