import React from 'react';

import CustomButton from "../custom-button/custom-button.component";

import { HeaderContainer, UserSectionContainer, HeaderLink, NavLink } from './header.styles';

const Header = (props) => {
  return (
    <HeaderContainer>
      < HeaderLink to="/">
        MessageNode
      </ HeaderLink>
      {props.isAuth && props.isAuth !== 'undefined' ?
        <CustomButton onClick={props.onLogout} logout>Logout</CustomButton>
        :
        <UserSectionContainer>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </UserSectionContainer>
      }
    </HeaderContainer>
  )
};
export default Header;