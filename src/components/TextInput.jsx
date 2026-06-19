import './TextInput.css'

/**
 * Labeled text input matching the Figma text-field component.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.icon - imported svg src for the leading icon
 * @param {string} [props.placeholder]
 * @param {string} [props.type]
 * @param {string} [props.name]
 * @param {string} [props.value]
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} [props.onChange]
 */
export default function TextInput({
  label,
  icon,
  placeholder = 'Input',
  type = 'text',
  name,
  value,
  onChange,
  required,
}) {
  const id = `field-${name ?? label.toLowerCase()}`

  return (
    <div className="text-input">
      <label className="text-input__label" htmlFor={id}>
        {label}
      </label>
      <div className="text-input__control">
        {icon && <img className="text-input__icon" src={icon} alt="" aria-hidden="true" />}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  )
}
