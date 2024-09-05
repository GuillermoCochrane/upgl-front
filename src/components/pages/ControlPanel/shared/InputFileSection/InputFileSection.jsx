import PropTypes from "prop-types";

const InputFileSection = ({ 
  name,
  id,
  label,
  onChange,
  onBlur,
  validations, 
  disabled,
  styles,
  accept,
  fileName
}) => {

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
      if (onBlur) onBlur(file);
    }
  };

  return (
  <section className={styles}>
    <label htmlFor={id}> {label} </label>
    <input
      type="file"
      name={name}
      id={id}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      accept={accept}
    />
    {fileName && <p className="success">{fileName}</p>}
    {
      <span className="error">
        {validations && validations[name] ? validations[name].msg : "\u00A0"}
      </span> 
    }
  </section>);
};

InputFileSection.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  styles: PropTypes.string,
  validations: PropTypes.object,
  onBlur: PropTypes.func,
  accept: PropTypes.string,
  disabled: PropTypes.bool,
  fileName: PropTypes.string,
};
export default InputFileSection;