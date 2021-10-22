import styled, { css } from "styled-components";

const statusButtonStyles = css`
  background-color: transparent;
  color: #000;
  margin-top: -1rem;
`;

const postButtonStyles = css`
  background-color: transparent;
  color: #6e00ad;
`;

const cancelButtonStyles = css`
  background-color: transparent;
  color: #ff0000;
`;

const deleteButtonStyles = css`
  background-color: transparent;
  color: #ff0000;
`;

const disableButtonStyles = css`
  background-color: #888888;
  color: #fff;
`;

const logOutButtonStyles = css`
  font-size: 1.8rem;
  background-color: transparent;
  color: #fff;
`;

const newPostButtonStyles = css`
  font-weight: 700;
  background-color: #fff34d;
  color: #6e00ad;
  box-shadow: 1px 5px 8px #888888;
`;

const paginationButtonStyles = css`
  color: #6e00ad;
  background-color: transparent;
  border: 1px solid #6e00ad;
`;

const getButtonStyles = props => {
  if (props.status) {
    return statusButtonStyles;
  }

  if (props.cancel) {
    return cancelButtonStyles;
  }

  if (props.newPost) {
    return newPostButtonStyles;
  }

  if (props.disable) {
    return disableButtonStyles;
  }

  if (props.post) {
    return postButtonStyles;
  }

  if (props.delete) {
    return deleteButtonStyles;
  }

  if (props.logout) {
    return logOutButtonStyles;
  }

  if (props.pg) {
    return paginationButtonStyles;
  }
}

export const CustomButtonContainer = styled.button`
  font-size: 1.5rem;
  background-color: #6e00ad;
  color: #fff;
  padding: 0.7rem 1rem;
  border: none;
  outline: none;
  cursor: pointer;

  ${getButtonStyles};
`;