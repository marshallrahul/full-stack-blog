import React from 'react';

import { GroupContainer, FormInputContainer, FormInputLabel } from "./form-input.styles";

const FormInput = ({ label, handleChange, ...otherProps }) => (
  <GroupContainer>
    {
      label ? <FormInputLabel>{label}</FormInputLabel> : null
    }
    <FormInputContainer onChange={handleChange} {...otherProps} />
  </GroupContainer>
);

export default FormInput;