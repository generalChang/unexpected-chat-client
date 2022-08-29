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
  GROUP_CHAT,
  success_msg,
} from "../../../Config/config";
import ChatRoom from "../../../utils/ChatRoom";
const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;
function GroupChatPage(props) {
  const socket = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [roomname, setRoomname] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    socket.current = io(`${BASE_URL}`, { transports: ["websocket"] });

    socket.current.emit("public_rooms", chatCategory[0].type);

    socket.current.on("public_rooms", (type, publicRooms) => {
      if (GROUP_CHAT === type) {
        setRooms(publicRooms);
      }
    });

    socket.current.on("welcome", (obj) => {
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: `${obj.username} join this chatroom!`,
      });
    });

    socket.current.on("send_msg", (obj) => {
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: obj.msg,
      });
    });

    socket.current.on("leave_room", (obj) => {
      addMessage({
        username: obj.username,
        image: obj.image,
        msg: `${obj.username} leaved this chatroom.. TT`,
      });
    });
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChatModal = (e) => {
    setIsModalVisible(true);
    e.preventDefault();
  };

  const addMessage = (body) => {
    setMessages((messages) => [...messages, body]);
  };

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

  const handleEnterRoom = (roomId) => {
    let body = {
      roomId,
      username: user.userData.username,
      image: user.userData.imageUpdated
        ? `${BASE_URL}/${user.userData.image}`
        : user.userData.image,
      roomtype: GROUP_CHAT,
    };

    socket.current.emit("enter_room", body, () => {
      const roomIdParsed = JSON.parse(roomId);
      setRoomId(roomId);
      setRoomname(roomIdParsed.roomname);
      addMessage({
        username: user.userData.username,
        image: user.userData.imageUpdated
          ? `${BASE_URL}/${user.userData.image}`
          : user.userData.image,

        msg: `${user.userData.username} joined this chatroom!`,
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
      roomtype: GROUP_CHAT,
    };

    socket.current.emit("leave_room", body, (obj) => {
      message.success(success_msg("leaved chat room"));
      setRoomId(null);
      setRoomname("");
      props.history.push("/");
    });
  };
  const renderRoomList = () => {
    return rooms.map((room, index) => {
      const roomid = JSON.parse(room.roomId);
      return (
        <Col key={index} lg={6} md={8} xs={12}>
          <a onClick={() => handleEnterRoom(room.roomId)}>
            <Card hoverable>
              <Meta
                title={roomid.roomname}
                description={`User : ${room.userCount} people`}
              />
            </Card>
          </a>
        </Col>
      );
    });
  };
  const onChatRoomSearch = (value) => {
    if (!value) {
      message.warning("Please input your room name!");
      return;
    }

    let body = {
      roomname: value,
      username: user.userData.username,
      image: user.userData.imageUpdated
        ? `${BASE_URL}/${user.userData.image}`
        : user.userData.image,
      roomtype: GROUP_CHAT,
    };

    socket.current.emit("create_room", body, (obj) => {
      const roomid = JSON.parse(obj);
      message.success(success_msg("created chat room!!"));
      setRoomId(obj);
      setRoomname(roomid.roomname);
      addMessage({
        username: user.userData.username,
        image: user.userData.imageUpdated
          ? `${BASE_URL}/${user.userData.image}`
          : user.userData.image,
        msg: `${user.userData.username} created this chatroom!`,
      });
    });

    setIsModalVisible(false);
  };
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        {!roomId && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={3}>
              <WechatOutlined style={{ fontSize: "2.5rem" }} />
              <span style={{ marginLeft: "0.5rem" }}>Group Chat Rooms</span>
            </Title>
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={handleChatModal}
            >
              Create Chatroom
            </Button>
          </div>
        )}
        {roomId && (
          <Title level={3}>
            <span style={{ marginLeft: "0.5rem" }}>{roomname}</span>
          </Title>
        )}
      </div>
      {!roomId && (
        <div style={{ margin: "2rem auto" }}>
          <Modal
            title="Chat Room Name"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Search
              placeholder="input room name.."
              onSearch={onChatRoomSearch}
              enterButton
              allowClear
            />
          </Modal>
          <Row gutter={[32, 32]} style={{ margin: "2rem auto" }}>
            {renderRoomList()}
          </Row>
        </div>
      )}

      {roomId && (
        <div style={{ margin: "2rem auto" }}>
          <ChatRoom
            messages={messages}
            sendMessage={handleSendMessage}
            leaveRoom={handleLeaveRoom}
          />
        </div>
      )}
    </div>
  );
}

export default withRouter(GroupChatPage);
