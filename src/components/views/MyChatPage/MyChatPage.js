import { WechatOutlined } from "@ant-design/icons";
import { Card, Typography, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { API_CHAT, BASE_URL, ERR_MSG, fail_msg } from "../../../Config/config";
import ChatRoomList from "../HistoryChatPage/sections/ChatRoomList";

const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;

function MyChatPage(props) {
  const user = useSelector((state) => state.user);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    getChatRooms();
  }, [user.userData]);

  const getChatUnRead = async (rooms) => {
    let newChatRooms = [];
    for (const chatRoom of rooms) {
      let body = {
        roomId: chatRoom._id,
      };
      await axios
        .post(`${BASE_URL}/${API_CHAT}/unreadChat`, body, {
          withCredentials: true,
        })
        .then((result) => {
          if (result.data.success) {
            newChatRooms.push({
              ...chatRoom,
              unReadCount: result.data.unReadCount,
            });
          } else {
          }
        });
    }

    setChatRooms(newChatRooms);
  };
  const getChatRooms = () => {
    if (user.userData) {
      let body = {
        userId: user.userData._id,
      };

      axios
        .post(`${BASE_URL}/${API_CHAT}/chatroomsByUser`, body)
        .then((result) => {
          if (result.data.success) {
            getChatUnRead(result.data.chatRooms);
          }
        })
        .catch((err) => {
          message.error(ERR_MSG);
        });
    }
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
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title level={3}>
            <WechatOutlined style={{ fontSize: "2.5rem" }} />
            <span style={{ marginLeft: "0.5rem" }}>My Chat Rooms</span>
          </Title>
        </div>
      </div>

      <div style={{ margin: "2rem auto" }}>
        <ChatRoomList chatRooms={chatRooms} onChatRoomClick={onChatRoomClick} />
      </div>
    </div>
  );
}

export default withRouter(MyChatPage);
