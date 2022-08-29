import { HomeFilled, LogoutOutlined, ProfileOutlined } from "@ant-design/icons";
import { message } from "antd";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { ERR_MSG, fail_msg, success_msg } from "../../../Config/config";
import IconBtn from "../../../utils/IconBtn";
import { logout } from "../../../_actions/user_actions";

function NavBar(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout())
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("Loged out"));
          props.history.push("/login");
          return;
        } else {
          message.warning(fail_msg("logout"));
          return;
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Perfectos</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">
                <IconBtn title="Home" IconComponent={HomeFilled} />
              </Nav.Link>
            </Nav>
            {user && user.userData && !user.userData.isAuth && (
              <Nav>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </Nav>
            )}
            {user && user.userData && user.userData.isAuth && (
              <Nav>
                <Nav.Link href="/user/profile">
                  <IconBtn title="Profile" IconComponent={ProfileOutlined} />
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <IconBtn title="Logout" IconComponent={LogoutOutlined} />
                </Nav.Link>
              </Nav>
            )}
            {/* <Nav>
              <NavDropdown title="Etc" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              </NavDropdown>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default withRouter(NavBar);
