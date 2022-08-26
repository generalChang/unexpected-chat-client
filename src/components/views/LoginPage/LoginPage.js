import { Button, Form, Input, Typography, message, Tooltip } from "antd";
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
import { useDispatch } from "react-redux";
import { login } from "../../../_actions/user_actions";
const { Title } = Typography;

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const onChangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      message.warning("please input your info!!");
      return;
    }

    let body = {
      email,
      password,
    };

    dispatch(login(body))
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("logined"));
          props.history.push("/");
          return;
        } else {
          message.warning(result.payload.msg);
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div style={{ maxWidth: "350px", margin: "5rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Login</Title>
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
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            type="text"
            value={email}
            onChange={onChangeEmail}
            placeholder="Please input your email!"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="Password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            type="password"
            value={password}
            onChange={onChangePassword}
            placeholder="Please input your Password!"
          />
        </Form.Item>

        <Tooltip title="Reset Password!">
          <Typography.Link href="/reset/password">
            forgot password?
          </Typography.Link>
        </Tooltip>
        <Button
          type="primary"
          size="large"
          shape="round"
          style={{ float: "right" }}
          htmlType="submit"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(LoginPage);
