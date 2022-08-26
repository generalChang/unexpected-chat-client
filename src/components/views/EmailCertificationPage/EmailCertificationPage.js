import { Button, Form, Input, Typography, message, Alert } from "antd";
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
import { emailCertificate } from "../../../_actions/user_actions";

const { Title } = Typography;

function EmailCertificationPage(props) {
  const [authCode, setAuthCode] = useState("");
  const dispatch = useDispatch();
  const handleVerifyEmail = (e) => {
    e.preventDefault();

    if (!authCode) {
      message.warning(input_message("info"));
      return;
    }

    let body = {
      authCode,
    };

    dispatch(emailCertificate(body))
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("email certificated"));
          props.history.push("/");
          return;
        } else {
          message.warning(fail_msg("email certificated"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };

  const onAuthCodeChange = (e) => {
    setAuthCode(e.currentTarget.value);
  };

  return (
    <div style={{ maxWidth: "350px", margin: "4rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Email Certification</Title>
      </div>
      <div>
        <Alert
          message="Email verification required"
          description="Before we can continue, we need to validate your email address. So, check your email and input auth code you received"
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
          label="AuthCode"
          name="AuthCode"
          rules={[
            {
              required: true,
              message: "Please input your AuthCode!",
            },
          ]}
        >
          <Input
            type="text"
            value={authCode}
            onChange={onAuthCodeChange}
            placeholder="Please input your authCode"
          />
        </Form.Item>

        <Button
          type="danger"
          size="large"
          shape="round"
          style={{ float: "right" }}
          htmlType="submit"
          onClick={handleVerifyEmail}
        >
          Verify
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(EmailCertificationPage);
