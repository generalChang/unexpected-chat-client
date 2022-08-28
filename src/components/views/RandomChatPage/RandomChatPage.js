import { WechatOutlined } from "@ant-design/icons";
import {
  Card,
  Typography,
  Col,
  Row,
  Button,
  Modal,
  Input,
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import {
  BASE_URL,
  chatCategory,
  RANDOM_CHAT,
  success_msg,
} from "../../../Config/config";
import ChatRoom from "../../../utils/ChatRoom";
const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;

function RandomChatPage(props) {
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>아직 제작 단계에 있습니다.</div>
    </div>
  );
}

export default withRouter(RandomChatPage);
