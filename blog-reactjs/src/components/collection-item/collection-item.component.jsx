import React from 'react';

import CustomButton from "../custom-button/custom-button.component";

import { PostContainer, TitleContainer, ButtonContainer, CreatorContainer, DetailsLink } from "./collection-item.style";

const CollectionItem = (props) => (
  <PostContainer>
    <CreatorContainer>Posted by {props.name} on {props.createdAt} </CreatorContainer>
    <TitleContainer>{props.title}</TitleContainer>
    <ButtonContainer>
      <DetailsLink to={`/${props.id}`}>VIEW</DetailsLink>
      <CustomButton onClick={props.editHandler} post>EDIT</CustomButton>
      <CustomButton onClick={props.deleteHandler} delete>DELETE</CustomButton>
    </ButtonContainer>
  </PostContainer>
);

export default CollectionItem;