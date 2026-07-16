import type { ChangeEventHandler } from 'react'

interface FormInputProps {
  id: string
  name: string
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  required?: boolean
  autoComplete?: string
}

function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="form-field__control"
      />
    </div>
  )
}

export default FormInput
