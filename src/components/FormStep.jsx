import React from 'react';
import { FormField } from './FormField';
import { stellantisFieldSchema } from '../flows/stellantis/stellantisFieldSchema';

export const FormStep = ({ fields, formData, errors, onFieldChange }) => {
  return (
    <div className="form-step-fields">
      {fields.map((fieldId) => {
        const schema = stellantisFieldSchema[fieldId];
        if (!schema) return null;

        return (
          <FormField
            key={fieldId}
            id={fieldId}
            schema={schema}
            value={formData[fieldId]}
            error={errors[fieldId]}
            onChange={onFieldChange}
          />
        );
      })}
    </div>
  );
};
