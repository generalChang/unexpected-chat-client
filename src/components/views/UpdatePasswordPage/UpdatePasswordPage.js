import { Button, Form, Input, Typography, message, Tooltip, Alert } from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  ERR_MSG,
  fail_msg,
  input_message,
  success_msg,
} from "../../../Config/config";
import { useDispatch } from "react-redux";
import { resetPassword, updatePassword } from "../../../_actions/user_actions";
const { Title } = Typography;

function UpdatePasswordPage(props) {
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const onPasswordChange = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!password) {
      message.warning(input_message("info"));
      return;
    }

    let body = {
      password,
    };
    dispatch(updatePassword(body))
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("Updated your password!"));
          props.history.push("/");
          return;
        } else {
          message.warning(fail_msg("update password"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div style={{ maxWidth: "350px", margin: "4rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Password Reset</Title>
      </div>
      <div>
        <Alert
          message="Update Password"
          description="Write your new password!!"
          type="info"
          showIcon
          closable
        />
      </div>
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          margin: "1rem auto",
        }}
      >
        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Please input your password"
          />
        </Form.Item>

        <Button
          type="default"
          size="large"
          shape="round"
          style={{ float: "right" }}
          htmlType="submit"
          onClick={handleUpdatePassword}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
export default withRouter(UpdatePasswordPage);
