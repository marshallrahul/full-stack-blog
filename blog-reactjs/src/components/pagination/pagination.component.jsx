import React from 'react';

import CustomButton from "../custom-button/custom-button.component";

import { PaginationContainer } from "./pagination.style";

const Pagination = (props) => {
  return (
    <>
      <PaginationContainer>
        <CustomButton onClick={props.onPrev} style={{ visibility: !props.hasPrev ? 'hidden' : '' }} pg>PREVIUS</CustomButton>
        <CustomButton onClick={props.onNext} style={{ visibility: !props.hasNext ? 'hidden' : '' }} pg>NEXT</CustomButton>
      </PaginationContainer>
    </>
  )
};

export default Pagination;