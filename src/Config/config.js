export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://unexpected-chat-server.herokuapp.com"
    : `http://localhost:5000`;
export const API_USER = `api/user`;
export const API_CHAT = "api/chat";
export const API_FRIEND = "api/friend";
export const ERR_MSG = "Error!! Try it later.";
export const fail_msg = (msg) => {
  return `Failed to ${msg}... sorry..`;
};
export const success_msg = (msg) => {
  return `Successfully ${msg}!!!`;
};

export const input_message = (msg) => {
  return `Please input ${msg}..`;
};

export const GROUP_CHAT = "GROUP_CHAT";
export const RANDOM_CHAT = "RANDOM_CHAT";
export const CALL_CHAT = "CALL_CHAT";
export const HISTORY_CHAT = "HISTORY_CHAT";

export const chatCategory = [
  {
    img: `${BASE_URL}/uploads/group-chat.png`,
    name: "Group Chat",
    desc: "누구나 방을 새롭게 만들어 여러사람과 채팅할 수 있어요",
    url: "/group/chat",
    type: "GROUP_CHAT",
  },
  {
    img: `${BASE_URL}/uploads/random-chat.png`,
    name: "Random Chat with Stranger",
    desc: "낯선사람과 1대1로 매칭되어 채팅할 수 있어요.",
    url: "/random/chat",
    type: "RANDOM_CHAT",
  },
  {
    img: `${BASE_URL}/uploads/video-chat.png`,
    name: "Video Chat with Stranger",
    desc: "누구나 방을 새롭게 만들어 화상채팅할 수 있어요.",
    url: "/video/chat",
    type: "CALL_CHAT",
  },
  {
    img: `${BASE_URL}/uploads/history-chat.png`,
    name: "History Chat",
    desc: "누구나 방을 새롭게 만들어 여러사람과 채팅할 수 있어요. 그리고 채팅내역도 남아요",
    url: "/historyChat",
    type: "HISTORY_CHAT",
  },
];
