import PropTypes from "prop-types";

const TextAreaSection = ({ 
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
  styles, 
  rows,
  columns
}) => {

  return (
    <section className={styles}>
      <label htmlFor={id}> {label} </label>
      <textarea 
        name={name}
        id={id}
        value={value}
        onChange={(e) => onChange(name,e.target.value)}
        onBlur={onBlur}
        onInput={onInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        cols={columns}
      />
      {
        <span className="error">
          {validations[name] ? validations[name].msg : "\u00A0"}
        </span> 
      }
    </section>);
};

TextAreaSection.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  validations: PropTypes.object.isRequired,
  styles: PropTypes.string,
  onBlur: PropTypes.func,
  onInput: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  columns: PropTypes.number,
};

export default TextAreaSection;