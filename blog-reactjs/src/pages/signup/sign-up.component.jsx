import React, { useState } from 'react';

import FormInput from "../../components/form-input/form-input.component";
import CustomButton from "../../components/custom-button/custom-button.component";

import { SignUpContainer, WrappedContainer } from "./sign-up.styles";

const SignUp = (props) => {
  const [userCredentials, setCredentials] = useState({ name: "", email: "", password: "" })

  const { name, email, password } = userCredentials;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials({ ...userCredentials, [name]: value })
  }

  return (
    <WrappedContainer>
      <SignUpContainer>
        <form onSubmit={(e) => props.onSignup(e, userCredentials)}>
          <FormInput
            name="name"
            type="text"
            onChange={handleChange}
            value={name}
            label="YOUR NAME"
            placeholder="Name"
            required
          />
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
          <CustomButton type="submit">SIGNUP</CustomButton>
        </form>
      </SignUpContainer>
    </WrappedContainer>
  );
};

export default SignUp;