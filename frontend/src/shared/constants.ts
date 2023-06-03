export const endpoints = {
  LOGIN: `user/login`,
  ME: `user/me`,
  MY_ROOMS: `room/me`,
  ROOM_BY_ID: `room/`,
  SEND_MESSAGE: `message/send`,
};

export const routes = {
  LOGIN: `/`,
  REGISTER: `register`,
  ROOMS: `/`,
  SELECTED_ROOM: `selected-room`,
};

export const PASSWORD_RULES =
  "*Password must contain an uppercase letter, a lowercase letter, and a number, with a minimum of 8 characters.";
export const PASSWORD_MATCH_RULES =
  "*New Password and New Password Confirmation fields must match.";
