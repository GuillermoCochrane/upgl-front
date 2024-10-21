import PropTypes from "prop-types";

const CheckboxSection = ({
  name,
  label,
  checked,
  onChange,
  disabled,
  styles,
}) => {
  return (
    <label className={styles}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(name, e.target.checked )}
        disabled={disabled}
      />
      {label}
    </label>
  );
};

CheckboxSection.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  styles: PropTypes.string,
};

export default CheckboxSection;
