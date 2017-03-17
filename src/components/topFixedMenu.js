import React from 'react';
import { Menu, Icon, Header, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TopFixedMenu = ({ title, toggleVisibility }) => (
  <Menu fixed="top">
    <Container>
      <Menu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
        <Icon name="sidebar" style={{ padding: 0 }}/>
      </Menu.Item>
      <Menu.Item header>
        <h3 className="main-title">
          Kabbalah Media
          <small>&nbsp;- {title}</small>
        </h3>
      </Menu.Item>
      <Menu.Item as={Link} to="/home"> Features </Menu.Item>
      <Menu.Item as={Link} to="/home"> Testimonials </Menu.Item>
      <Menu.Item as={Link} to="/home"> Sign-in </Menu.Item>
    </Container>
  </Menu>
);

export default TopFixedMenu;

