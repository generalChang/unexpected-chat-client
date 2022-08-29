import {
  Button,
  Form,
  Input,
  Typography,
  Radio,
  InputNumber,
  message,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
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
import FileUpload from "../../../utils/FileUpload";

const { Title } = Typography;

function ProfileUpdatePage(props) {
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const user = useSelector((state) => state.user);

  const onChangeUsername = (e) => {
    setUsername(e.currentTarget.value);
  };

  const onChangeGender = (e) => {
    setGender(e.target.value);
  };
  const onChangeAge = (value) => {
    setAge(value);
  };

  const handleProfileImage = (img) => {
    setImage(img);
  };
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    if (!username || !gender || !age) {
      message.warning("Please input everything");
      return;
    }

    let body = {
      imageUpdated: image !== "",
      image,
      username,
      gender,
      age,
    };
    axios
      .post(`${BASE_URL}/${API_USER}/profile/upload`, body, {
        withCredentials: true,
      })
      .then((result) => {
        if (result.data.success) {
          message.success(success_msg("updated your profile"));
          props.history.push("/user/profile");
          return;
        } else {
          message.warning(fail_msg("upload your profile"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };

  useEffect(() => {
    if (user && user.userData) {
      setUsername(user.userData.username);
      setGender(user.userData.gender);
      setAge(user.userData.age);
    }
  }, [user]);
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <Title level={3}>
          <ProfileFilled style={{ fontSize: "2.5rem" }} />
          <span style={{ marginLeft: "0.5rem" }}>Profile Update</span>
        </Title>
      </div>
      <div style={{ margin: "3rem auto", maxWidth: "700px" }}>
        <Form
          style={{
            margin: "1rem auto",
          }}
        >
          <FileUpload handleImage={handleProfileImage} />
          <Divider />
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
              placeholder={username}
              onChange={onChangeUsername}
            />
          </Form.Item>

          <div
            style={{
              marginLeft: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            <Radio.Group value={gender} onChange={onChangeGender}>
              {Gender.map((g) => {
                return (
                  <Radio value={g.value} checked={g.value === gender}>
                    {g.label}
                  </Radio>
                );
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
              placeholder={age}
              onChange={onChangeAge}
              min={7}
              max={120}
              value={age}
            />
          </Form.Item>
          <Button
            type="success"
            size="large"
            shape="round"
            style={{ float: "right" }}
            htmlType="submit"
            onClick={handleProfileUpdate}
          >
            Complete
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default withRouter(ProfileUpdatePage);
