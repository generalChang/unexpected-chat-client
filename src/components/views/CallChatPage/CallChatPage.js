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
  CALL_CHAT,
  chatCategory,
  GROUP_CHAT,
  success_msg,
} from "../../../Config/config";
import ChatRoom from "../../../utils/ChatRoom";
const { Meta } = Card;
const { Title } = Typography;
const { Search } = Input;
function CallChatPage(props) {
  const socket = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [roomname, setRoomname] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connectedSomeone, setConnectedSomeone] = useState(false);
  const [firstConnect, setFirstConnect] = useState(false);

  const user = useSelector((state) => state.user);

  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const setVideoTracks = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      if (!(pcRef.current && socket.current)) return;

      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });

      pcRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          if (!socket.current) return;
          socket.current.emit("candidate", e.candidate);
        }
      };

      pcRef.current.ontrack = (ev) => {
        //상대방의 sessiondescription을 본인의 remotesessiondescription
        //으로 지정하면 해당 이벤트가 발생한다.
        if (remoteVideoRef.current) {
          console.log(ev.streams);
          remoteVideoRef.current.srcObject = ev.streams[0];
        }
      };
    } catch (e) {
      console.log(e);
    }
  };

  const createOffer = async () => {
    if (!(pcRef.current && socket.current)) return;
    try {
      const sdp = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
      socket.current.emit("offer", sdp);
    } catch (e) {}
  };

  const createAnswer = async (sdp) => {
    if (!(pcRef.current && socket.current)) return;
    try {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));

      const mySdp = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
      socket.current.emit("answer", mySdp);
    } catch (e) {}
  };
  useEffect(() => {
    if (!firstConnect) {
      socket.current = io(`${BASE_URL}`, { transports: ["websocket"] });
      setFirstConnect(true);
    }
    if (!connectedSomeone) {
      pcRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:ntk-turn-2.xirsys.com"] },
          {
            username:
              "NqYeMxsAmieGSyZeLyrujM9DvAssQ4xfE-s2folQuisY1R4LWXej0dEoqdsxehshAAAAAGLnl2lnZW5lcmFsY2hhbmc=",
            credential: "20c7bade-1179-11ed-bca8-0242ac120004",
            urls: [
              "turn:ntk-turn-2.xirsys.com:80?transport=udp",
              "turn:ntk-turn-2.xirsys.com:3478?transport=udp",
              "turn:ntk-turn-2.xirsys.com:80?transport=tcp",
              "turn:ntk-turn-2.xirsys.com:3478?transport=tcp",
              "turns:ntk-turn-2.xirsys.com:443?transport=tcp",
              "turns:ntk-turn-2.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      });

      socket.current.emit("public_rooms", CALL_CHAT);

      socket.current.on("public_rooms", (type, publicRooms) => {
        if (CALL_CHAT === type) {
          setRooms(publicRooms);
        }
      });

      socket.current.on("welcome", (obj) => {
        setConnectedSomeone(true);
        createOffer();
      });

      socket.current.on("leave-video-chat-room", (obj) => {
        setConnectedSomeone(false);
      });
      socket.current.on("getOffer", (sdp) => {
        createAnswer(sdp);
      });

      socket.current.on("getAnswer", (sdp) => {
        if (!pcRef.current) return;
        pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        //console.log(sdp);
      });

      socket.current.on("getCandidate", async (candidate) => {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });

      setVideoTracks();
    }
  }, [connectedSomeone, firstConnect]);

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

  const handleEnterRoom = (roomId) => {
    let body = {
      roomId,
      roomtype: CALL_CHAT,
    };

    socket.current.emit("enter-video-chat-room", body, (isJoin) => {
      if (isJoin) {
        const roomIdParsed = JSON.parse(roomId);
        setRoomId(roomId);
        setRoomname(roomIdParsed.roomname);
        message.success(success_msg("joined chat room"));
        setConnectedSomeone(true);
      } else {
        message.warning("Maximum people!!!");
      }
    });
  };

  const handleLeaveRoom = (e) => {
    e.preventDefault();
    let body = {
      roomId,
      roomtype: CALL_CHAT,
    };

    socket.current.emit("leave-video-chat-room", body, (obj) => {
      message.success(success_msg("leaved chat room"));
      setRoomId(null);
      setRoomname("");
      setConnectedSomeone(false);
      if (pcRef.current && socket.current) {
        pcRef.current.close();
        socket.current.disconnect();
      }

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
      roomtype: CALL_CHAT,
    };

    socket.current.emit("create-video-chat-room", body, (roomId) => {
      setRoomId(roomId);
      const roomIdParsed = JSON.parse(roomId);
      setRoomname(roomIdParsed.roomname);
      message.success(success_msg("created chat room"));
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
              <span style={{ marginLeft: "0.5rem" }}>Call Chat Rooms</span>
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

      <div style={{ margin: "2rem auto" }}>
        <Row gutter={[32, 32]} style={{ margin: "2rem auto" }}>
          <Col lg={8} md={12} xs={24}>
            <video
              style={{
                width: 400,
                height: 400,

                backgroundColor: "black",
              }}
              muted
              ref={localVideoRef}
              autoPlay
            />
          </Col>
          <Col lg={8} md={12} xs={24}>
            {!connectedSomeone && (
              <div
                style={{
                  width: 400,
                  height: 400,
                  position: "absolute",
                  zIndex: 10,
                  backgroundColor: "black",
                  opacity: 0.8,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                <p>Your Partner just left or not joined...</p>
              </div>
            )}

            <video
              id="remotevideo"
              style={{
                width: 400,
                height: 400,

                backgroundColor: "black",
              }}
              ref={remoteVideoRef}
              autoPlay
            />
          </Col>
          <Col lg={8} md={12} xs={24}>
            <Button
              type="default"
              danger
              size="large"
              shape="round"
              onClick={handleLeaveRoom}
            >
              Exit
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default withRouter(CallChatPage);
