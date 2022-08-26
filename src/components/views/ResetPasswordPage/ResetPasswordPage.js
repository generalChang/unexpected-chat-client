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
import { resetPassword } from "../../../_actions/user_actions";
const { Title } = Typography;

function ResetPasswordPage(props) {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const dispatch = useDispatch();
  const onChangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!email) {
      message.warning(input_message("info"));
      return;
    }

    let body = {
      email,
    };
    dispatch(resetPassword(body))
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("initialized password"));
          setResetSuccess(true);
          return;
        } else {
          message.warning(fail_msg("reset password"));
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
        {resetSuccess ? (
          <Alert
            message="We reseted your password!!"
            description="Check your email and login using that password you received"
            type="success"
            showIcon
            closable
          />
        ) : (
          <Alert
            message="Password Reset Form"
            description="Write your email address and we will set randomly password"
            type="info"
            showIcon
            closable
          />
        )}
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
          label="email"
          name="email"
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
            placeholder="Please input your email"
          />
        </Form.Item>

        <Button
          type="default"
          size="large"
          shape="round"
          style={{ float: "right" }}
          htmlType="submit"
          onClick={handleResetPassword}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(ResetPasswordPage);
