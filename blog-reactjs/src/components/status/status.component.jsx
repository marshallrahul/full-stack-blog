import React, { useState } from 'react';

import FormInput from "../form-input/form-input.component";
import CustomButton from "../../components/custom-button/custom-button.component";

import { StatusContainer, StatusFormInput } from "./status.styles";

const Status = () => {
  const [status, setStatus] = useState({ value: "" });

  const { value } = status;

  const handleSubmit = (event) => {
    event.preventDefalut();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStatus({ ...status, [name]: value })
  }

  return (
    <StatusContainer>
      <StatusFormInput onSubmit={handleSubmit}>
        <FormInput
          name="value"
          type="text"
          onChange={handleChange}
          value={value}
          placeholder="Your status"
          status
        />
        <CustomButton status>UPDATE</CustomButton>
      </StatusFormInput>
    </StatusContainer>
  )
};

export default Status;