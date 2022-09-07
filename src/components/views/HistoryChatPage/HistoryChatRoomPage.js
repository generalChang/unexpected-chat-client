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
import HistoryChatRoom from "./sections/HistoryChatRoom";
const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;
function HistoryChatRoomPage(props) {
  const user = useSelector((state) => state.user);
  const [roomId, setRoomId] = useState(props.match.params.roomId);
  const [roomname, setRoomname] = useState(props.match.params.roomname);
  const [chattings, setChattings] = useState([]);
  const [joiners, setJoiners] = useState([]);
  const [owner, setOwner] = useState(null);
  let chatInterval;
  let joinerInterval;

  const chattingIntervalFunc = useRef();
  const joinerListFunc = useRef();

  useEffect(() => {
    getChatRoom();
    chattingIntervalFunc.current = () => {
      getChattings();
    };
    joinerListFunc.current = () => {
      getJoiners();
    };

    chatInterval = setInterval(chattingIntervalFunc.current, 400);
    joinerInterval = setInterval(joinerListFunc.current, 400);

    return () => {
      clearInterval(chatInterval);
      clearInterval(joinerInterval);
    };
  }, []);
  const getChatRoom = () => {
    let body = {
      roomId: props.match.params.roomId,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/chatroom`, body)
      .then((result) => {
        if (result.data.success) {
          setOwner(result.data.chatRoom.userId._id);
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const getChattings = () => {
    if (!roomId) {
      return;
    }
    let body = {
      roomId,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/chat`, body, { withCredentials: true })
      .then((result) => {
        if (result.data.success) {
          setChattings(result.data.chatting);
        } else {
          if (result.data.closed) {
            message.warning("This room has been closed...");
            setRoomId(null);
            setRoomname("");
            setChattings((prev) => []);
            props.history.push("/historyChat");
          } else {
            message.warning(fail_msg("access chat"));
          }
        }
      })
      .catch((err) => {});
  };
  const getJoiners = () => {
    if (!roomId) {
      return;
    }
    let body = {
      roomId,
    };
    axios
      .post(`${BASE_URL}/${API_CHAT}/joiners`, body)
      .then((result) => {
        if (result.data.success) {
          setJoiners(result.data.joiners);
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const onSendMessageClick = (msg) => {
    if (!msg) {
      message.warning(input_message("your message"));
      return;
    }

    let body = {
      chatRoom: roomId,
      userId: user.userData._id,
      message: msg,
    };
    axios
      .post(`${BASE_URL}/${API_CHAT}/sendMessage`, body)
      .then((result) => {
        if (!result.data.success) {
          if (result.data.closed) {
            message.warning("This room has been closed...");
            setRoomId(null);
            setRoomname("");
            setChattings((prev) => []);
            props.history.push("/historyChat");
          } else {
            message.warning(fail_msg("send message"));
          }
        } else {
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const onExitClick = () => {
    let body = {
      roomId,
      userId: user.userData._id,
      message: `${user.userData.username} leave this chat room.. TT`,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/exit`, body)
      .then((result) => {
        if (result.data.success) {
          message.success("left chat room");
          setRoomId(null);
          setRoomname("");
          setChattings((prev) => []);
          props.history.push("/historyChat");
        } else {
          if (result.data.leaveExitedRoom) {
            //이미 폐쇄된 채팅방인경우
            setRoomId(null);
            setRoomname("");
            setChattings((prev) => []);
            props.history.push("/historyChat");
          } else {
            message.warning("leave chat room");
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
        <Title level={3}>
          <span style={{ marginLeft: "0.5rem" }}>{roomname}</span>
        </Title>
      </div>

      <div style={{ margin: "2rem auto" }}>
        <HistoryChatRoom
          chattings={chattings}
          onSendMessageClick={onSendMessageClick}
          onExitClick={onExitClick}
          joiners={joiners}
          owner={owner}
        />
      </div>
    </div>
  );
}

export default withRouter(HistoryChatRoomPage);
