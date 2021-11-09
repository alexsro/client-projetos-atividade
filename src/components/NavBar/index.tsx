import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
} from './styles';

const Navbar: React.FC = () => (
  <>
    <Nav>
      <NavMenu>
        <NavLink to="/">
          Principal
        </NavLink>
        <NavLink to="/projects">
          Projetos
        </NavLink>
        <NavLink to="/activities">
          Atividades
        </NavLink>
      </NavMenu>
    </Nav>
  </>
);

export default Navbar;
