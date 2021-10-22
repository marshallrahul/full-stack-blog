import styled, { css } from "styled-components";

const statusInputStyles = css`
  min-width: 25rem;
`;

const textAreaStyles = css`
  height: 10rem;
`;

const getStyles = props => {
  if (props.status) {
    return statusInputStyles;
  }

  if (props.textArea) {
    return textAreaStyles;
  }
}

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormInputContainer = styled.input`
  height: 3rem;
  margin-bottom: 1.2rem;

  ${getStyles};

  &:focus {
    outline: none;
  }

  &::-webkit-input-placeholder {
    font-family: 'Open Sans', sans-serif;
  }
`;

export const FormInputLabel = styled.label`
  font-size: 1.7rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;
