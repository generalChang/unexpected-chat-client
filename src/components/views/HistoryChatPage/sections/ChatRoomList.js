import { Card, Col, Row, Badge, Avatar } from "antd";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { API_CHAT, BASE_URL } from "../../../../Config/config";
const { Meta } = Card;
function ChatRoomList(props) {
  const onChatRoomClick = (chatRoom) => {
    props.onChatRoomClick(chatRoom);
  };

  const renderRoomList = () => {
    return (
      <Row gutter={[32, 32]}>
        {props.chatRooms &&
          props.chatRooms.map((chatRoom, index) => {
            console.log(chatRoom.unReadCount);
            return (
              <Col key={index} lg={6} md={8} xs={12}>
                <a onClick={() => onChatRoomClick(chatRoom)}>
                  <div
                    style={{
                      borderRadius: "15px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#d2dae2",
                      padding: "15px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          textOverflow: "ellipsis" /* 말줄임 css */,
                          whiteSpace: "nowrap" /*글자를 한줄로 모아준다*/,
                          overflow: "hidden",
                        }}
                      >
                        {chatRoom.title}
                      </span>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <p>Owner : {chatRoom.userId.username}</p>

                      <div style={{ position: "absolute", top: -10, left: 10 }}>
                        <Badge count={chatRoom.unReadCount} />
                      </div>
                    </div>
                  </div>
                </a>
              </Col>
            );
          })}
      </Row>
    );
  };
  return renderRoomList();
}

export default withRouter(ChatRoomList);
