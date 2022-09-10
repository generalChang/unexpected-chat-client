import {
  Button,
  Form,
  Input,
  Typography,
  message,
  Tooltip,
  Divider,
} from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  API_CHAT,
  API_FRIEND,
  API_USER,
  BASE_URL,
  ERR_MSG,
  fail_msg,
  success_msg,
} from "../../../Config/config";
import { useDispatch, useSelector } from "react-redux";
import { getUser, login } from "../../../_actions/user_actions";
import { ProfileFilled, UserAddOutlined } from "@ant-design/icons";
import { Gender } from "../../../Config/gender";
import { useEffect } from "react";

const { Title } = Typography;

function ProfilePage(props) {
  const userId = props.match.params.id;
  const user = useSelector((state) => state.user);
  const [someone, setSomeone] = useState(null);
  const [friendsRequestMe, setFriendsRequestMe] = useState([]);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();

  const getUserById = () => {
    let body = {
      userId,
    };
    dispatch(getUser(body))
      .then((result) => {
        if (result.payload.success) {
          setSomeone(result.payload.user);
        } else {
          message.warning(fail_msg("get user"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  useEffect(() => {
    if (user.userData) {
      getUserById();
    }
    if (user.userData && user.userData._id === userId) {
      //본인일떄
      getWaitingForApproval();
      getFriendsId();
    }
  }, [user.userData]);

  const getFriendsInfo = async (friendsId) => {
    let body = {
      friendsId,
    };

    await axios
      .post(`${BASE_URL}/${API_FRIEND}/friendsInfo`, body)
      .then((result) => {
        if (result.data.success) {
          setFriends(result.data.users);
        } else {
          message.warning(fail_msg("get friends"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const getFriendsId = async () => {
    await axios
      .get(`${BASE_URL}/${API_FRIEND}/friends`, { withCredentials: true })
      .then((result) => {
        if (result.data.success) {
          getFriendsInfo(result.data.friends);
        } else {
          message.warning(fail_msg("get friends"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const getWaitingForApproval = () => {
    //승인 대기 중인 친구 목록 가져오기.
    let body = {
      userTo: user.userData._id,
      request: 1,
    };

    axios
      .post(`${BASE_URL}/${API_FRIEND}/waitingForApproval`, body)
      .then((result) => {
        if (result.data.success) {
          setFriendsRequestMe(result.data.friendsRequestMe);
        } else {
          message.warning(fail_msg("get waiting for Approval friends"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const makeImagePath = (image, imageUpdated) => {
    return imageUpdated ? `${BASE_URL}/${image}` : image;
  };
  const renderFriendsRequestMe = () => {
    return friendsRequestMe.map((frm, index) => {
      return (
        <div
          style={{ padding: "10px 10px", display: "flex", width: "200px" }}
          key={index}
        >
          <img
            src={makeImagePath(frm.image, frm.imageUpdated)}
            width="60px"
            height="60px"
            style={{ objectFit: "contain", borderRadius: "30px" }}
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
              {frm.username}
            </span>
            <button
              style={{
                padding: "5px",
                borderRadius: "15px",
                backgroundColor: "#ff5e57",
                borderWidth: "0px",
                fontSize: "1rem",
                fontWeight: "600",
                marginLeft: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => {
                onFriendAcceptClick(frm._id);
              }}
            >
              Accept
            </button>
          </div>
        </div>
      );
    });
  };

  const renderFriends = () => {
    return friends.map((friend, index) => {
      return (
        <div
          style={{
            marginBottom: "1rem",
            marginLeft: "1rem",
            padding: "10px 10px",
            display: "flex",
            width: "200px",
          }}
          key={index}
        >
          <img
            src={makeImagePath(friend.image, friend.imageUpdated)}
            width="60px"
            height="60px"
            style={{ objectFit: "contain", borderRadius: "30px" }}
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
              {friend.username}
            </span>
            <button
              style={{
                padding: "5px",
                borderRadius: "15px",
                backgroundColor: "#ff5e57",
                borderWidth: "0px",
                fontSize: "1rem",
                fontWeight: "600",
                marginLeft: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={() => onGoToChatClick(friend._id, friend.username)}
            >
              Go to Chat
            </button>
          </div>
        </div>
      );
    });
  };

  const onChatRoomClick = async (chatRoom) => {
    //join chat room
    let body = {
      chatRoom: chatRoom._id,
      userId: user.userData._id,
      message: `${user.userData.username} joined this chat room!`,
    };

    await axios
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

  const getPrivacyChatRoom = async (partnerId) => {
    let body = {
      userId: user.userData._id,
      partner: partnerId,
    };

    await axios
      .post(`${BASE_URL}/${API_CHAT}/chatPrivacyRoom`, body)
      .then((result) => {
        if (result.data.success) {
          onChatRoomClick(result.data.chatRoom);
        } else {
          message.warning(fail_msg("join privacy room"));
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const onGoToChatClick = (id, username) => {
    let body = {
      title: `${user.userData.username} and ${username} Chatroom`,
      userId: user.userData._id,
      partner: id,
      privacy: true,
    };

    axios
      .post(`${BASE_URL}/${API_CHAT}/createPrivacyChatRoom`, body)
      .then((result) => {
        if (result.data.success) {
          props.history.push(
            `/historyChatRoom/${result.data.chatRoom._id}/${result.data.chatRoom.title}`
          );
        } else {
          if (result.data.isAlreadyPrivacyChat) {
            //이미 있다면 방을 만들게 아니라 join을 해야함.
            getPrivacyChatRoom(id);
          } else {
            message.warning(fail_msg("create privacy room"));
          }
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const onFriendAcceptClick = (id) => {
    let body = {
      me: user.userData._id,
      partner: id,
    };

    axios
      .post(`${BASE_URL}/${API_FRIEND}/acceptFriend`, body)
      .then((result) => {
        if (result.data.success) {
          message.success(success_msg("add a friend"));
          getFriendsId(); //친구목록 다시가져오기.
          getWaitingForApproval(); //승인대기중 목록ㄷ ㅏ시가져오기.
        } else {
          if (result.data.isAlreadyFriend) {
            message.warning(
              "This partner is already deleted or you've already added this friend."
            );
          } else {
            message.warning(fail_msg("added a friend"));
          }
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  const onFriendRequestClick = () => {
    if (user.userData._id === props.match.params.id) {
      message.warning("You cannot friend request yours.");
      return;
    }
    let body = {
      userFrom: user.userData._id,
      userTo: props.match.params.id,
      request: 1,
    };

    axios
      .post(`${BASE_URL}/${API_FRIEND}/requestFriend`, body)
      .then((result) => {
        if (result.data.success) {
          if (result.data.alreadyRequest) {
            message.success("Hey!! you've already request friend!!!");
          } else {
            message.success(success_msg("request friend"));
          }
        } else {
          if (result.data.isAlreadyFriend) {
            message.success("Hey!! you've already add this friend!!!");
          } else {
            message.warning(fail_msg("request friend"));
          }
        }
      })
      .catch((err) => {
        message.error(ERR_MSG);
      });
  };
  return (
    <div style={{ width: "85%", margin: "4rem auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={3}>
          <ProfileFilled style={{ fontSize: "2.5rem" }} />
          <span style={{ marginLeft: "0.5rem" }}>Profile</span>
        </Title>
        <div style={{ display: "flex" }}>
          {someone && user.userData && someone._id === user.userData._id && (
            <a href="/user/update">
              <Button size="large" type="primary" shape="round">
                Update
              </Button>
            </a>
          )}
          {someone && user.userData && someone._id !== user.userData._id && (
            <div>
              <button
                style={{
                  padding: "10px",
                  borderRadius: "15px",
                  backgroundColor: "#ffa801",
                  borderWidth: "0px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginLeft: "1rem",
                  display: "flex",
                }}
                onClick={onFriendRequestClick}
              >
                <UserAddOutlined style={{ fontSize: "1.5rem" }} />
                <span>Add to friends</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ margin: "2rem auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Profile Image
          </p>
          {someone && (
            <img
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                objectFit: "contain",
              }}
              src={
                someone.imageUpdated === false
                  ? someone.image
                  : `${BASE_URL}/${someone.image}`
              }
            />
          )}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Your name
          </p>

          <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {someone && someone.username}
          </p>
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Gender
          </p>

          {someone && someone.gender && (
            <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {Gender.map((g, index) => {
                if (someone.gender === g.value) {
                  return g.label;
                }
              })}
            </p>
          )}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <p
            style={{ fontSize: "1rem", fontWeight: "600", marginRight: "1rem" }}
          >
            Age
          </p>

          {someone && someone.age && (
            <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
              {someone.age}
            </p>
          )}
        </div>
        <Divider />

        {someone && user.userData && someone._id === user.userData._id && (
          <div style={{ marginTop: "3rem" }}>
            <Title level={3}>
              <ProfileFilled style={{ fontSize: "2.5rem" }} />
              <span style={{ marginLeft: "0.5rem" }}>Friends</span>
            </Title>
            <div style={{ display: "flex" }}>{renderFriends()}</div>
          </div>
        )}

        <Divider />

        {someone && user.userData && someone._id === user.userData._id && (
          <div style={{ marginTop: "3rem" }}>
            <Title level={3}>
              <ProfileFilled style={{ fontSize: "2.5rem" }} />
              <span style={{ marginLeft: "0.5rem" }}>Waiting for approval</span>
            </Title>
            <div style={{ display: "flex" }}>{renderFriendsRequestMe()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(ProfilePage);
