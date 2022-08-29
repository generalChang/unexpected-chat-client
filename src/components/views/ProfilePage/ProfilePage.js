import {
  Button,
  Form,
  Input,
  Typography,
  message,
  Tooltip,
  Divider,
} from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  API_USER,
  BASE_URL,
  ERR_MSG,
  fail_msg,
  success_msg,
} from "../../../Config/config";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../_actions/user_actions";
import { ProfileFilled } from "@ant-design/icons";
import { Gender } from "../../../Config/gender";

const { Title } = Typography;

function ProfilePage(props) {
  const user = useSelector((state) => state.user);
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <Title level={3}>
          <ProfileFilled style={{ fontSize: "2.5rem" }} />
          <span style={{ marginLeft: "0.5rem" }}>Profile</span>
        </Title>
      </div>
      <div style={{ margin: "2rem auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Profile Image
          </p>
          {user && user.userData && user.userData.image && (
            <img
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                objectFit: "contain",
              }}
              src={
                user.userData.imageUpdated === false
                  ? user.userData.image
                  : `${BASE_URL}/${user.userData.image}`
              }
            />
          )}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Your name
          </p>

          <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {user.userData && user.userData.username}
          </p>
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Gender
          </p>

          {user.userData && user.userData.gender && (
            <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {Gender.map((g, index) => {
                if (user.userData.gender === g.value) {
                  return g.label;
                }
              })}
            </p>
          )}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Age
          </p>

          {user.userData && user.userData.age && (
            <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {user.userData.age}
            </p>
          )}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <a href="/user/update">
            <Button size="large" type="primary" shape="round">
              Update
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default withRouter(ProfilePage);
