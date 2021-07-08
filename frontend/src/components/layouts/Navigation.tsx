import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT_USER } from 'actions/types';
import { Nav, Navbar } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { State } from 'interfaces';

const Navigation = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const isLogged = useSelector((state: State) => state.user.isLogged);

  const handleLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_USER
    });

    history.push('/login')
  }, [dispatch, history]);

  const handleOnClick = useCallback((path) => {
    history.push(path);
    setExpanded(false)
  }, [history]);


  return isLogged ?
    <Navbar expanded={expanded} variant='dark' bg='dark' expand="lg">
      <Navbar.Brand
        onClick={() => handleOnClick('/')}>
        <i className="fas fa-book-reader"></i> Read&Write
        </Navbar.Brand>
      <Navbar.Toggle
        onClick={() => setExpanded(expanded ? false : true)}
        aria-controls="navbar-nav"
      />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => handleOnClick('/articles')}>Articles</Nav.Link>
          <Nav.Link onClick={() => handleOnClick('/profiles')}>Profiles</Nav.Link>
          <Nav.Link onClick={() => handleOnClick('/article')}>My articles</Nav.Link>
          <Nav.Link onClick={() => handleOnClick('/profile')}>My profile</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={() => handleOnClick('/change')}>
            Change password
            </Nav.Link>
          <Nav.Link onClick={handleLogout}>
            Sign out <i className="fas fa-sign-out-alt"></i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    :
    <Navbar expanded={expanded} variant='dark' bg='dark' expand="lg">
      <Navbar.Brand onClick={() => handleOnClick('/')}>
        <i className="fas fa-book-reader"></i> Read&Write
        </Navbar.Brand>
      <Navbar.Toggle
        onClick={() => setExpanded(expanded ? false : true)}
        aria-controls="navbar-nav"
      />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => handleOnClick('/articles')}>Articles</Nav.Link>
          <Nav.Link onClick={() => handleOnClick('/profiles')}>Profiles</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link onClick={() => handleOnClick('/login')}>
            Sign in <i className="fas fa-sign-out-alt"></i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
}


export default Navigation;