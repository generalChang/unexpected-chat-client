import { Button, Form, Input, Typography, message, Tooltip, Alert } from "antd";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  ERR_MSG,
  fail_msg,
  input_message,
  success_msg,
} from "../../../Config/config";
import { setTmpPassword } from "../../../_actions/user_actions";
const { Title } = Typography;
function NewPasswordPage(props) {
  const [newPassword, setNewPassword] = useState("");
  const id = props.match.params.id;
  const dispatch = useDispatch();
  function generateRandomPassword() {
    return Math.floor(Math.random() * 10 ** 8)
      .toString()
      .padStart("0", 8);
  }

  const handleTmpPassword = (newPw) => {
    let body = {
      randomPw: newPw,
      id,
    };

    dispatch(setTmpPassword(body))
      .then((result) => {
        if (result.payload.success) {
          return;
        } else {
          message.warning(fail_msg("set tempory password"));
          return;
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  useEffect(() => {
    const newPw = generateRandomPassword();
    setNewPassword(newPw);
    handleTmpPassword(newPw);
  }, []);
  return (
    <div style={{ maxWidth: "350px", margin: "4rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>New Password</Title>
      </div>
      <div>
        <Alert
          message="New Password Form"
          description="this is your new password. try to login using this password."
          type="info"
          showIcon
          closable
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>Your new temporary password!!</div>
          <h3>[{newPassword}]</h3>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NewPasswordPage);
