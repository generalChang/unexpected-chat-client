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
  Collapse,
} from "antd";
import { BASE_URL } from "../../../../Config/config";
import { Gender } from "../../../../Config/gender";
import moment from "moment";

const { Panel } = Collapse;
function HistoryChatRoom(props) {
  const chatScrollRef = useRef();
  const joinerScrollRef = useRef();
  const [message, setMessage] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  let scrollIntervalFuncRef = useRef();

  let scrollIntervelRef = useRef();

  useEffect(() => {
    scrollIntervalFuncRef.current = () => {
      scrollToBottom();
    };

    scrollIntervelRef.current = setInterval(scrollIntervalFuncRef.current, 400);
  }, []);
  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const makeImagePath = (image, imageUpdated) => {
    return imageUpdated ? `${BASE_URL}/${image}` : image;
  };
  const renderChattings = () => {
    if (props.chattings) {
      return props.chattings.map((chatting, index) => {
        return (
          <Comment
            key={index}
            author={
              <a>
                {chatting.userId.username}
                {props.owner &&
                  props.owner === chatting.userId._id &&
                  "(Owner)"}
              </a>
            }
            avatar={
              <Avatar
                src={makeImagePath(
                  chatting.userId.image,
                  chatting.userId.imageUpdated
                )}
                alt={chatting.userId.username}
              />
            }
            content={<p>{chatting.message}</p>}
            datetime={
              <span>
                {moment(new Date(chatting.createdAt)).format(
                  "YYYY.MM.DD hh:mm:ss"
                )}
              </span>
            }
          />
        );
      });
    }
  };

  const renderJoiners = () => {
    if (props.joiners) {
      return props.joiners.map((joiner, index) => {
        return (
          <div style={{ padding: "10px 0px", display: "flex" }}>
            <img
              src={makeImagePath(joiner.image, joiner.imageUpdated)}
              width="60px"
              height="60px"
              style={{ objectFit: "contain" }}
            />
            <div
              style={{
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {joiner.username}
                {props.owner && props.owner === joiner._id && "(Owner)"}
              </span>
              <span style={{ fontSize: "13px", fontWeight: "500" }}>
                Age : {joiner.age}
              </span>

              <span>Gender: {getGender(joiner.gender)}</span>
            </div>
          </div>
        );
      });
    }
  };

  const getGender = (value) => {
    let genderString = "";
    Gender.forEach((g, index) => {
      if (g.value === value) {
        genderString = g.label;
      }
    });
    return genderString;
  };
  const onSendMessageClick = () => {
    props.onSendMessageClick(message);
    setMessage("");
  };

  const onExitClick = () => {
    props.onExitClick();
  };
  const onChange = (e) => setMessage(e.currentTarget.value);

  const onAutoScrollClick = () => {
    if (autoScroll) {
      clearInterval(scrollIntervelRef.current);
    } else {
      scrollIntervelRef.current = setInterval(
        scrollIntervalFuncRef.current,
        400
      );
    }

    setAutoScroll((prev) => !prev);
  };
  return (
    <Row gutter={[32, 32]}>
      <Col lg={18} xs={24}>
        <div
          ref={chatScrollRef}
          style={{ overflowY: "scroll", height: "500px" }}
        >
          {/* rendermessages */}
          {renderChattings()}
        </div>

        <Form style={{ display: "flex" }}>
          <Input
            type="text"
            value={message}
            size="large"
            placeholder="input message..."
            onChange={onChange}
          />
          <Button
            size="large"
            type="danger"
            htmlType="submit"
            onClick={onSendMessageClick}
          >
            Send
          </Button>
        </Form>
      </Col>
      <Col lg={6} xs={24}>
        <Button
          type="default"
          danger
          size="large"
          shape="round"
          onClick={onExitClick}
        >
          Exit
        </Button>
        <Button
          type="default"
          size="large"
          shape="round"
          style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}
          onClick={onAutoScrollClick}
        >
          Auto Scroll {autoScroll ? " Off" : " On"}
        </Button>
        <Divider />
        <div>
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Joiners" key="1">
              <div
                ref={joinerScrollRef}
                style={{ overflowY: "scroll", height: "350px" }}
              >
                {renderJoiners()}
              </div>
            </Panel>
          </Collapse>
        </div>
      </Col>
    </Row>
  );
}

export default withRouter(HistoryChatRoom);
