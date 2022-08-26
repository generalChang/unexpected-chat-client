export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://unexpected-chat-server.herokuapp.com"
    : `http://localhost:5000`;
export const API_USER = `api/user`;

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
