import {
  HomeFilled,
  LogoutOutlined,
  ProfileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { message, Badge } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  API_CHAT,
  BASE_URL,
  ERR_MSG,
  fail_msg,
  success_msg,
} from "../../../Config/config";
import IconBtn from "../../../utils/IconBtn";
import { logout } from "../../../_actions/user_actions";

function NavBar(props) {
  const user = useSelector((state) => state.user);
  const [allUnReadChat, setAllUnReadChat] = useState(0);
  const dispatch = useDispatch();
  let getUnreadFunc = useRef();
  let getUnreadInterval = useRef();
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
  useEffect(() => {
    if (user.userData && user.userData.isAuth) {
      getUnreadFunc.current = () => {
        getChatRooms();
      };

      getUnreadInterval.current = setInterval(getUnreadFunc.current, 1000);
      // getChatRooms();
    }
  }, [user.userData]);

  const getChatUnRead = async (rooms) => {
    let allUnread = 0;
    for (const chatRoom of rooms) {
      let body = {
        roomId: chatRoom._id,
      };
      await axios
        .post(`${BASE_URL}/${API_CHAT}/unreadChat`, body, {
          withCredentials: true,
        })
        .then((result) => {
          if (result.data.success) {
            allUnread += result.data.unReadCount;
          } else {
          }
        });
    }
    setAllUnReadChat(allUnread);
  };
  const getChatRooms = () => {
    if (user.userData) {
      let body = {
        userId: user.userData._id,
      };

      axios
        .post(`${BASE_URL}/${API_CHAT}/chatroomsByUser`, body)
        .then((result) => {
          if (result.data.success) {
            getChatUnRead(result.data.chatRooms);
          }
        })
        .catch((err) => {
          message.error(ERR_MSG);
        });
    }
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
                <Nav.Link href="/mychat/page" style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: -7, left: 0 }}>
                    <Badge count={allUnReadChat} size="small" />
                  </div>

                  <IconBtn title="MyChat" IconComponent={TeamOutlined} />
                </Nav.Link>
                <Nav.Link href={`/user/profile/${user.userData._id}`}>
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
