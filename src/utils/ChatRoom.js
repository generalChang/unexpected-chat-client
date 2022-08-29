import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Col,
  Row,
  Button,
  Modal,
  Input,
  message,
  Form,
  Avatar,
  Comment,
  Divider,
} from "antd";
import { RANDOM_CHAT } from "../Config/config";
function ChatRoom(props) {
  const [msg, setMsg] = useState("");
  const scrollRef = useRef();
  const renderMessages = () => {
    if (!props.messages) {
      return "";
    } else {
      return props.messages.map((message, index) => {
        return (
          <Comment
            key={index}
            author={<a>{message.username}</a>}
            avatar={<Avatar src={message.image} alt={message.username} />}
            content={<p>{message.msg}</p>}
          />
        );
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);
  const onMsgChange = (e) => {
    setMsg(e.currentTarget.value);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msg) {
      message.warning("Please input your comment!!");
      return;
    }

    props.sendMessage(msg);
    setMsg("");
  };

  const handleLeaveRoom = (e) => {
    e.preventDefault();
    props.leaveRoom();
  };

  const handleStartSearchingSomeone = (e) => {
    e.preventDefault();
    props.startSearchSomeone();
  };
  return (
    <Row gutter={[32, 32]}>
      <Col lg={18} xs={24}>
        <div ref={scrollRef} style={{ overflowY: "scroll", height: "500px" }}>
          {renderMessages()}
        </div>
        {props.type !== RANDOM_CHAT && (
          <Form style={{ display: "flex" }}>
            <Input
              type="text"
              onChange={onMsgChange}
              value={msg}
              size="large"
              placeholder="input message..."
            />
            <Button
              size="large"
              type="danger"
              onClick={handleSendMessage}
              htmlType="submit"
            >
              Send
            </Button>
          </Form>
        )}
        {props.type === RANDOM_CHAT && (
          <Form style={{ display: "flex" }}>
            <Input
              type="text"
              onChange={onMsgChange}
              value={msg}
              size="large"
              placeholder="input message..."
              disabled={props.roomId === null}
            />
            <Button
              size="large"
              type="danger"
              onClick={handleSendMessage}
              htmlType="submit"
              disabled={props.roomId === null}
            >
              Send
            </Button>
          </Form>
        )}
      </Col>
      <Col lg={6} xs={24}>
        {props.type !== RANDOM_CHAT && (
          <Button
            type="default"
            danger
            size="large"
            shape="round"
            onClick={handleLeaveRoom}
          >
            Exit
          </Button>
        )}
        {props.type === RANDOM_CHAT && (
          <div>
            <Button
              type="default"
              danger
              size="large"
              shape="round"
              onClick={handleStartSearchingSomeone}
              disabled={props.roomId !== null}
            >
              Start
            </Button>
            <Divider />
            <Button
              type="default"
              danger
              size="large"
              shape="round"
              disabled={props.roomId === null}
              onClick={handleLeaveRoom}
            >
              Exit
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
}

export default withRouter(ChatRoom);
