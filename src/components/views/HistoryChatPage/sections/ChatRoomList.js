import { Card, Col, Row } from "antd";
import axios from "axios";
import React from "react";
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
            return (
              <Col key={index} lg={6} md={8} xs={12}>
                <a onClick={() => onChatRoomClick(chatRoom)}>
                  <Card hoverable>
                    <Meta
                      title={`${chatRoom.title}`}
                      description={`Owner : ${chatRoom.userId.username}`}
                    />
                  </Card>
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
