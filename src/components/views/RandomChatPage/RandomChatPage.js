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
import moment from "moment";
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
  const user = useSelector((state) => state.user);
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    socket.current = io(`${BASE_URL}`, { transports: ["websocket"] });

    socket.current.on("enter_room", (result) => {
      setRoomId(result);
      addMessage({
        username: "Super Manager",
        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
        msg: `Successfully connected with someone!! Let's talk!`,
      });
    });

    socket.current.on("send_msg", (obj) => {
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: obj.msg,
      });
    });

    socket.current.on("leave_random_chat_room", (obj) => {
      setRoomId(null);
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: `${obj.username} leaved this chatroom.. TT`,
      });
    });
  }, []);

  const handleSendMessage = (msg_content) => {
    let body = {
      roomId,
      username: user.userData.username,
      image: user.userData.imageUpdated
        ? `${BASE_URL}/${user.userData.image}`
        : user.userData.image,
      msg: msg_content,
    };
    socket.current.emit("send_msg", body, (obj) => {
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: obj.msg,
      });
    });
  };
  const handleLeaveRoom = () => {
    let body = {
      roomId,
      username: user.userData.username,
      image: user.userData.imageUpdated
        ? `${BASE_URL}/${user.userData.image}`
        : user.userData.image,
    };

    socket.current.emit("leave_random_chat_room", body, (obj) => {
      setRoomId(null);
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: `${obj.username} leaved this chatroom.. TT`,
      });
    });
  };

  const addMessage = (body) => {
    setMessages((messages) => [...messages, body]);
  };
  const startSearchSomeone = () => {
    setMessages((messages) => []);
    socket.current.emit("startSearchingSomeone", () => {
      addMessage({
        username: "Super Manager",
        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
        msg: `Wait.. We're looking for someone...`,
      });
    });
  };
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <Title level={3}>
          <WechatOutlined style={{ fontSize: "2.5rem" }} />
          <span style={{ marginLeft: "0.5rem" }}>Random Chat</span>
        </Title>
      </div>
      <div style={{ margin: "2rem auto" }}>
        <ChatRoom
          messages={messages}
          sendMessage={handleSendMessage}
          leaveRoom={handleLeaveRoom}
          type={RANDOM_CHAT}
          startSearchSomeone={startSearchSomeone}
          roomId={roomId}
        />
      </div>
    </div>
  );
}

export default withRouter(RandomChatPage);
