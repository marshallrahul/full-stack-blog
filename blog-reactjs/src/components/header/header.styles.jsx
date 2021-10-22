import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeaderContainer = styled.div`
  background-color: #6e00ad;
  color: #fff;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const HeaderLink = styled(Link)`
  font-size: 2rem;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.5rem;
  text-decoration: none;
`;

export const NavLink = styled(Link)`
  font-size: 1.8rem;
  font-weight: 500;
  text-decoration: none;
  color: #fff;

  &:first-child {
    margin-right: 3rem;
  }
`;