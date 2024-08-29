import PropTypes from 'prop-types';

const InputSection = ({ 
  type,
  name,
  id,
  label,
  value,
  onChange,
  onBlur,
  onInput,
  validations,
  placeholder, 
  disabled,
  styles
}) => {

  return (
  <section className={styles}>
    <label htmlFor={id}> {label} </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={(e) => onChange(name,e.target.value)}
      onBlur={onBlur}
      onInput={onInput}
      placeholder={placeholder}
      disabled={disabled}
    />
    {
      <span className='error'>
        {validations && validations[name] ? validations[name].msg : "\u00A0"}
      </span> 
    }
  </section>);
};

InputSection.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.string,
  validations: PropTypes.object,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
export default InputSection;