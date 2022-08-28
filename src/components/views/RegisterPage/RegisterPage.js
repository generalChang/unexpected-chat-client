import {
  Button,
  Form,
  Input,
  Typography,
  Radio,
  InputNumber,
  message,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  API_USER,
  BASE_URL,
  ERR_MSG,
  fail_msg,
  success_msg,
} from "../../../Config/config";
import { Gender } from "../../../Config/gender";
import { useDispatch } from "react-redux";
import { register } from "../../../_actions/user_actions";
import moment from "moment";
const { Title } = Typography;

function RegisterPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(10);
  const [gender, setGender] = useState(1);
  const dispatch = useDispatch();
  const onChangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onChangeUsername = (e) => {
    setUsername(e.currentTarget.value);
  };
  const onChangeAge = (value) => {
    setAge(value);
  };
  const onChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password || !username || !age || !gender) {
      message.warning("please input your info!!");
      return;
    }

    let body = {
      email,
      password,
      username,
      age,
      gender,
      image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
    };

    dispatch(register(body))
      .then((result) => {
        if (result.payload.success) {
          message.success(success_msg("Signed up"));
          props.history.push("/");
        } else {
          message.warning(fail_msg("Sign up"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div style={{ maxWidth: "350px", margin: "5rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Title level={2}>Register</Title>
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
          label="Username"
          name="Username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            type="text"
            value={username}
            placeholder="Please input your Username!"
            onChange={onChangeUsername}
          />
        </Form.Item>
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
            placeholder="Please input your email!"
            onChange={onChangeEmail}
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
            placeholder="Please input your Password!"
            onChange={onChangePassword}
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Radio.Group value={gender} onChange={onChangeGender}>
            {Gender.map((g) => {
              return <Radio value={g.value}>{g.label}</Radio>;
            })}
          </Radio.Group>
        </div>

        <Form.Item
          label="Age"
          name="Age"
          rules={[
            {
              required: true,
              message: "Please input your Age!",
            },
          ]}
        >
          <InputNumber
            onChange={onChangeAge}
            min={7}
            defaultValue={10}
            max={120}
            value={age}
          />
        </Form.Item>
        <Button
          type="default"
          danger
          size="large"
          shape="round"
          style={{ float: "right" }}
          htmlType="submit"
          onClick={handleRegister}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(RegisterPage);
