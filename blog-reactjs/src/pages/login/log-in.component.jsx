import React, { useState } from 'react';

import FormInput from "../../components/form-input/form-input.component";
import CustomButton from "../../components/custom-button/custom-button.component";

import { LogInContainer, WrappedContainer } from "./log-in.styles";

const LogIn = (props) => {
  const [userCredentials, setCredentials] = useState({ email: "", password: "" })

  const { email, password } = userCredentials;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...userCredentials, [name]: value })
  }

  return (
    <WrappedContainer>
      <LogInContainer>
        <form onSubmit={(e) => props.onLogin(e, userCredentials)}>
          <FormInput
            name="email"
            type="email"
            onChange={handleChange}
            value={email}
            label="YOUR E-MAIL"
            placeholder="Email"
            required
          />
          <FormInput
            name="password"
            type="password"
            onChange={handleChange}
            value={password}
            label="PASSWORD"
            placeholder="Password"
            required
          />
          <CustomButton type="submit">LOGIN</CustomButton>
        </form>
      </LogInContainer>
    </WrappedContainer>
  );
};

export default LogIn;