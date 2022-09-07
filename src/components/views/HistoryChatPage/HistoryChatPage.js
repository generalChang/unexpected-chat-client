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
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  API_CHAT,
  BASE_URL,
  ERR_MSG,
  fail_msg,
  input_message,
  success_msg,
} from "../../../Config/config";
import ChatRoomList from "./sections/ChatRoomList";
const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;
function HistoryChatPage(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.user);
  const [chatRooms, setChatRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(12); //불러올 데이터의 양
  const [skip, setSkip] = useState(0); //데이터를 불러올 위치.
  const [isNext, setIsNext] = useState(false);
  useEffect(() => {
    let body = { limit, skip };
    getChatRooms(body);
  }, []);

  const onSearchChange = (e) => {
    const {
      target: { value },
    } = e;
    setKeyword(value);
    onRoomSearch(value);
  };
  const getChatRooms = (body) => {
    axios
      .post(`${BASE_URL}/${API_CHAT}/chatrooms`, body)
      .then((result) => {
        if (result.data.success) {
          if (body.isLoadMore) {
            setChatRooms([...chatRooms, ...result.data.rooms]);
          } else {
            setChatRooms(result.data.rooms);
          }

          setIsNext(result.data.isNext);
        }
      })
      .catch((err) => {});
  };

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

  const onJoinClick = (value) => {
    if (value === "") {
      message.warning(input_message("title"));
      return;
    }

    let body = {
      userId: user.userData._id,
      title: value,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/createChatRoom`, body)
      .then((result) => {
        if (result.data.success) {
          message.success(success_msg("created chat room"));
          setIsModalVisible(false);

          props.history.push(
            `/historyChatRoom/${result.data.chatRoom._id}/${result.data.chatRoom.title}`
          );
        } else {
          message.warning(fail_msg("creat chat room"));
          return;
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };

  const onRoomSearch = (value) => {
    let body = {
      keyword: value,
      limit,
      skip: 0,
    };
    setSkip(0);
    getChatRooms(body);
  };
  const onChatRoomClick = (chatRoom) => {
    //join chat room
    let body = {
      chatRoom: chatRoom._id,
      userId: user.userData._id,
      message: `${user.userData.username} joined this chat room!`,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/join`, body)
      .then((result) => {
        if (result.data.success) {
          props.history.push(
            `/historyChatRoom/${result.data.chatRoom._id}/${result.data.chatRoom.title}`
          );
        } else {
          if (result.data.closed) {
            message.warning("This room has been already closed...");
          } else {
            message.warning(fail_msg("join this chat room"));
            return;
          }
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };

  const loadMoreClick = () => {
    let body = {
      keyword,
      limit,
      skip: skip + limit,
      isLoadMore: true,
    };

    getChatRooms(body);
    setSkip(skip + limit);
  };
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={3}>
            <WechatOutlined style={{ fontSize: "2.5rem" }} />
            <span style={{ marginLeft: "0.5rem" }}>History Chat Rooms</span>
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
      </div>

      <div
        style={{
          margin: "2rem auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "250px",
          }}
        >
          <Input
            placeholder="Search Chat rooms!!"
            onChange={onSearchChange}
            value={keyword}
            type="text"
            shape="round"
          />
        </div>
      </div>
      <div style={{ margin: "2rem auto" }}>
        <Modal
          title="Chat Room Name"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Search
            placeholder="input room name.."
            onSearch={onJoinClick}
            enterButton
            allowClear
          />
        </Modal>
        <ChatRoomList chatRooms={chatRooms} onChatRoomClick={onChatRoomClick} />
        <div
          style={{
            margin: "2rem auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isNext && (
            <Button onClick={loadMoreClick} type="primary" danger>
              LoadMore
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(HistoryChatPage);
