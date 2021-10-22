import styled from "styled-components";

export const PopUp = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.25);
  position: fixed;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const NewPostContainer = styled.div`
  height: 52rem;
  width: 50vw;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #fff;
`;

export const TitleContainer = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #6e00ad;
  border-bottom: 3px solid #0000008b;
  padding: 1rem;
  margin-bottom: 2rem;
`;

export const Container = styled.div`
  padding: 1rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const PostsContainer = styled.div`
  margin-top: 2rem;
`;