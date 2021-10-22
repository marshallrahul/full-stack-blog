import styled from "styled-components";
import { Link } from "react-router-dom";

export const PostContainer = styled.div`
  height: 15rem;
  width: 65rem;
  border: 2px solid #6e00ad;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 3rem;
  display: grid;
`;

export const CreatorContainer = styled.h2`
  color: #4b4b4b;
`;

export const TitleContainer = styled.h1`
  font-size: 2.5rem;
  color: #6e00ad;
`;

export const ButtonContainer = styled.div`
  justify-self: flex-end;
  align-self: center;
`;

export const DetailsLink = styled(Link)`
  font-size: 1.5rem;
  color: #6e00ad;
  text-decoration: none;
  padding: 0.7rem 1rem;
`;