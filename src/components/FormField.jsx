import React from 'react';

export const FormField = ({ id, schema, value, error, onChange }) => {
  const { label, type, placeholder, options } = schema;

  const handleInputChange = (e) => {
    onChange(id, e.target.value);
  };

  const wrapperClass = error ? "form-group has-error" : "form-group";

  return (
    <div className={wrapperClass}>
      <label htmlFor={id} className="form-label">
        {label} {schema.validation?.required && <span className="required-star">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={id}
          value={value || ""}
          onChange={handleInputChange}
          className="form-control"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          className="form-control text-area"
          rows={3}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          className="form-control"
        />
      )}

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
