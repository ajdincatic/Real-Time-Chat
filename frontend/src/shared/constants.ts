export const endpoints = {
  LOGIN: `user/login`,
  REGISTER: `user/register`,
  ME: `user/me`,
  MY_ROOMS: `room/me`,
  ROOM_BY_ID: `room/`,
  SEND_MESSAGE: `message/send`,
  CREATE_ROOM: `room/create`,
  GET_USERS: `user`,
  GET_10N1_ROOM_BY_MEMBERS: `room/1on1-by-members`,
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
